#!/usr/bin/env python3
"""
update_data.py - TRENDS Financial Markets Data Updater
=======================================================
1. Fetches live BTC price + 24h change from CoinGecko (free, no API key needed).
2. Fetches live values for the 6 market indices from the Yahoo Finance chart
   API (free, no API key needed). Per-index fallback: if a single ticker
   fails, only that index gets a random drift and is flagged estimated: true
   so the UI can label it as simulated.
3. Patches data.js in-place using regex, preserving full JS syntax.
4. Writes market-data.json (pure JSON with timestamp) fetched at runtime
   by the frontend, so the UI always shows the latest committed data.

Usage:
    python update_data.py   (su Windows: py update_data.py)

Requirements: Python 3.6+, stdlib only (no external packages needed).
"""

import re
import json
import random
import sys
import os
import time
from urllib import request
from urllib.parse import quote
from urllib.error import URLError, HTTPError
from datetime import datetime, timezone

from update_macro import fetch_fred  # riuso: serie FRED senza chiave (stdlib)

# --- CONFIG ------------------------------------------------------------------

DATA_JS_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.js")
MARKET_JSON_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "market-data.json")

COINGECKO_URL = (
    "https://api.coingecko.com/api/v3/simple/price"
    "?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
)
REQUEST_TIMEOUT = 12  # seconds

YAHOO_CHART_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?interval=1d&range=2d"

# Internal symbol -> Yahoo Finance ticker
YAHOO_TICKERS = {
    "SPX":     "^GSPC",
    "IXIC":    "^IXIC",
    "DJI":     "^DJI",
    "FTSEMIB": "FTSEMIB.MI",
    "GDAXI":   "^GDAXI",
    "N225":    "^N225",
}

# Fonti per i 17 strumenti (BTC escluso: resta su CoinGecko).
# type: "yahoo" (prezzo) | "fred" (rendimento %). fmt decide la stringa finale.
# Se il fetch fallisce, il valore esistente in data.js resta invariato e lo
# strumento viene marcato estimated: true (mai prezzi inventati).
INSTRUMENT_SOURCES = {
    "aapl":  {"type": "yahoo", "ref": "AAPL",    "fmt": "usd"},
    "msft":  {"type": "yahoo", "ref": "MSFT",    "fmt": "usd"},
    "nvda":  {"type": "yahoo", "ref": "NVDA",    "fmt": "usd"},
    "asml":  {"type": "yahoo", "ref": "ASML.AS", "fmt": "eur"},
    "lvmh":  {"type": "yahoo", "ref": "MC.PA",   "fmt": "eur"},
    "ko":    {"type": "yahoo", "ref": "KO",      "fmt": "usd"},
    "spy":   {"type": "yahoo", "ref": "SPY",     "fmt": "usd"},
    "qqq":   {"type": "yahoo", "ref": "QQQ",     "fmt": "usd"},
    "vwce":  {"type": "yahoo", "ref": "VWCE.DE", "fmt": "eur"},
    "water": {"type": "yahoo", "ref": "WAT.PA",  "fmt": "eur"},
    "gld":   {"type": "yahoo", "ref": "GLD",     "fmt": "usd"},
    "aggh":  {"type": "yahoo", "ref": "AGGH.MI", "fmt": "eur"},
    # GC=F: future front-month COMEX, proxy standard dello spot
    "gold":  {"type": "yahoo", "ref": "GC=F",    "fmt": "gold"},
    "us10y":  {"type": "fred", "ref": "DGS10",   "fmt": "yield"},
    "us2y":   {"type": "fred", "ref": "DGS2",    "fmt": "yield"},
    # OECD via FRED: serie mensile, in ritardo di ~2 mesi (reale ma lento)
    "btp10y": {"type": "fred", "ref": "IRLTLT01ITM156N", "fmt": "yield"},
}

# Reference values used to compute realistic index drifts (fallback only,
# when Yahoo is unreachable for a given ticker)
INDEX_BASES = {
    "SPX":      5304.72,
    "IXIC":    16735.02,
    "DJI":     39069.59,
    "FTSEMIB": 34490.50,
    "GDAXI":   18494.30,
    "N225":    38586.92,
}


# --- HELPERS -----------------------------------------------------------------

def fetch_btc_data():
    """Fetches BTC/USD price and 24h change-percent from CoinGecko public API."""
    print("[>>] Contatto CoinGecko API per dati BTC live...")
    try:
        req = request.Request(
            COINGECKO_URL,
            headers={"User-Agent": "TRENDS-Updater/1.0", "Accept": "application/json"},
        )
        with request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
            raw = resp.read()
            data = json.loads(raw)

        btc_price  = data["bitcoin"]["usd"]
        btc_change = data["bitcoin"]["usd_24h_change"]
        return btc_price, btc_change

    except (HTTPError, URLError) as e:
        print("[!!] Errore rete CoinGecko: {}. Uso dati statici fallback.".format(e))
        return None, None
    except (KeyError, json.JSONDecodeError) as e:
        print("[!!] Errore parsing risposta CoinGecko: {}. Uso dati statici fallback.".format(e))
        return None, None


def fmt_price(price_usd):
    """Returns BTC price as JS string value, e.g. '73,510.00 USD'."""
    return "{:,.2f} USD".format(price_usd)


def fmt_change(change):
    """Returns a signed change percent string, e.g. '+2.34%' or '-1.12%'."""
    sign = "+" if change >= 0 else ""
    return "{}{:.2f}%".format(sign, change)


def fetch_index_from_yahoo(ticker):
    """
    Fetches current price and previous close for an index from the Yahoo
    Finance chart API. Returns (price, prev_close) as floats.
    Raises on any network/parsing problem so the caller can fall back
    per-index instead of globally.
    """
    url = YAHOO_CHART_URL.format(ticker=quote(ticker))
    req = request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Accept": "application/json",
        },
    )
    with request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
        data = json.loads(resp.read())

    meta = data["chart"]["result"][0]["meta"]
    price = float(meta["regularMarketPrice"])
    prev_close = float(meta["chartPreviousClose"])
    if prev_close <= 0:
        raise ValueError("chartPreviousClose non valido: {}".format(prev_close))
    return price, prev_close


def random_drift(base_value, min_pct=0.3, max_pct=1.8):
    """
    Applies a random +- drift to a base index value.
    Returns (new_value_str, change_str, status_str).
    """
    pct       = random.uniform(min_pct, max_pct)
    direction = random.choice([1, -1])
    new_value  = base_value * (1.0 + direction * pct / 100.0)
    change_pct = direction * pct
    value_str  = "{:,.2f}".format(new_value)
    change_str = fmt_change(change_pct)
    status     = "positive" if direction == 1 else "negative"
    return value_str, change_str, status


def patch_instrument_in_js(js_text, instrument_id, price_str=None, change_str=None,
                           status=None, estimated=None):
    """
    Patches currentPrice/changePercent/status/estimated of one instrument in
    the instruments array. Strategy: split on the 'id: "<id>"' anchor, then
    replace only within the segment before the next 'id:' anchor.
    Any field passed as None is left untouched (used by the honest fallback:
    keep the old real value, just flag it estimated).
    """
    anchor = 'id: "{}"'.format(instrument_id)
    pos = js_text.find(anchor)
    if pos == -1:
        print("[!!] Anchor '{}' non trovato in data.js.".format(anchor))
        return js_text

    next_id_pos = js_text.find('id: "', pos + len(anchor))
    if next_id_pos == -1:
        next_id_pos = len(js_text)

    before  = js_text[:pos]
    segment = js_text[pos:next_id_pos]
    after   = js_text[next_id_pos:]

    if price_str is not None:
        segment = re.sub(
            r'(currentPrice:\s*")[^"]*(")',
            lambda m: m.group(1) + price_str + m.group(2),
            segment, count=1
        )
    if change_str is not None:
        segment = re.sub(
            r'(changePercent:\s*")[^"]*(")',
            lambda m: m.group(1) + change_str + m.group(2),
            segment, count=1
        )
    if status is not None:
        # status field: only replace the first occurrence (not inside historicalYields)
        segment = re.sub(
            r'(status:\s*")[^"]*(")',
            lambda m: m.group(1) + status + m.group(2),
            segment, count=1
        )
    if estimated is not None:
        estimated_str = "true" if estimated else "false"
        if re.search(r'estimated:\s*(?:true|false)', segment):
            segment = re.sub(r'(estimated:\s*)(?:true|false)',
                             lambda m: m.group(1) + estimated_str, segment, count=1)
        else:
            # Blocco senza il campo: lo inserisce subito dopo la riga status
            segment = re.sub(r'(status:\s*"[^"]*",)',
                             lambda m: m.group(1) + '\n      estimated: ' + estimated_str + ',',
                             segment, count=1)

    return before + segment + after


def fmt_instrument_price(value, fmt):
    """Formats a numeric value into the display string used by data.js."""
    if fmt == "usd":
        return "{:,.2f} USD".format(value)
    if fmt == "eur":
        return "{:,.2f} EUR".format(value)
    if fmt == "gold":
        return "{:,.2f} USD/oz".format(value)
    if fmt == "yield":
        return "{:.2f}% (Rendimento)".format(value)
    raise ValueError("Formato sconosciuto: {}".format(fmt))


def fetch_instrument(source):
    """
    Fetches the live value for one instrument.
    Returns (price_str, change_str, status). Raises on failure so the caller
    can apply the honest per-instrument fallback.
    """
    if source["type"] == "yahoo":
        price, prev_close = fetch_index_from_yahoo(source["ref"])
        change_pct = (price - prev_close) / prev_close * 100.0
        status = "positive" if change_pct >= 0 else "negative"
        return fmt_instrument_price(price, source["fmt"]), fmt_change(change_pct), status

    # FRED: serie di rendimenti in %, la variazione è un delta in punti
    series = fetch_fred(source["ref"])
    if len(series) < 2:
        raise ValueError("Serie FRED troppo corta: {}".format(source["ref"]))
    latest, prev = series[-1][1], series[-2][1]
    delta = latest - prev
    sign = "+" if delta >= 0 else ""
    status = "positive" if delta >= 0 else "negative"
    return (fmt_instrument_price(latest, source["fmt"]),
            "{}{:.2f} pt".format(sign, delta), status)


def patch_index_in_js(js_text, symbol, value_str, change_str, status, estimated):
    """
    Patches a single index entry (symbol/value/change/status/estimated) in the
    TRENDS_DATA.indices array. Uses a single-line object regex since
    index objects have no nested braces.
    """
    pattern = re.compile(
        r'(\{\s*symbol:\s*"' + re.escape(symbol) + r'"[^}]*?\})',
        re.DOTALL
    )
    match = pattern.search(js_text)
    if not match:
        print("[!!] Indice '{}' non trovato in data.js.".format(symbol))
        return js_text

    original = match.group(0)
    patched  = original

    patched = re.sub(r'(value:\s*")[^"]*(")',
                     lambda m: m.group(1) + value_str + m.group(2), patched, count=1)
    patched = re.sub(r'(change:\s*")[^"]*(")',
                     lambda m: m.group(1) + change_str + m.group(2), patched, count=1)
    patched = re.sub(r'(status:\s*")[^"]*(")',
                     lambda m: m.group(1) + status + m.group(2), patched, count=1)

    estimated_str = "true" if estimated else "false"
    if re.search(r'estimated:\s*(?:true|false)', patched):
        patched = re.sub(r'(estimated:\s*)(?:true|false)',
                         lambda m: m.group(1) + estimated_str, patched, count=1)
    else:
        # Older data.js without the field: insert it before the closing brace
        patched = re.sub(r'\s*\}$',
                         ', estimated: ' + estimated_str + ' }', patched, count=1)

    return js_text.replace(original, patched, 1)


# --- MAIN --------------------------------------------------------------------

def main():
    sep = "=" * 60
    print(sep)
    print("  TRENDS - Data Updater")
    print("  Eseguito: {}".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    print(sep)

    # 1. Read data.js
    if not os.path.exists(DATA_JS_PATH):
        print("[ERR] File non trovato: {}".format(DATA_JS_PATH))
        sys.exit(1)

    with open(DATA_JS_PATH, "r", encoding="utf-8") as f:
        js_text = f.read()

    print("[OK] data.js letto ({:,} caratteri)".format(len(js_text)))

    # 2. Fetch BTC from CoinGecko
    btc_price, btc_change = fetch_btc_data()

    if btc_price is not None:
        btc_estimated = False
        price_str  = fmt_price(btc_price)
        change_str = fmt_change(btc_change)
        btc_status = "positive" if btc_change >= 0 else "negative"
        print("[OK] BTC Price : {}".format(price_str))
        print("[OK] BTC 24h   : {}  [{}]".format(change_str, btc_status))
    else:
        btc_estimated = True
        print("[~~] Applicazione drift casuale a BTC come fallback...")
        base_btc   = 73510.0
        drift_pct  = random.uniform(0.5, 2.5) * random.choice([1, -1])
        btc_price  = base_btc * (1.0 + drift_pct / 100.0)
        btc_change = drift_pct
        price_str  = fmt_price(btc_price)
        change_str = fmt_change(btc_change)
        btc_status = "positive" if btc_change >= 0 else "negative"
        print("[~~] BTC (drift): {} ({})".format(price_str, change_str))

    # 3. Patch BTC block
    js_text = patch_instrument_in_js(js_text, "btc", price_str, change_str,
                                     btc_status, btc_estimated)
    print("[OK] Blocco BTC aggiornato")

    btc_json = {
        "currentPrice": price_str,
        "changePercent": change_str,
        "status": btc_status,
        "estimated": btc_estimated,
    }

    # 3b. Fetch live prices/yields for the other 16 instruments
    print("\n[>>] Prezzi live dei 16 strumenti (Yahoo Finance + FRED)...")
    instruments_json = {}
    ins_real, ins_fallback = 0, 0
    for ins_id, source in INSTRUMENT_SOURCES.items():
        try:
            ins_price, ins_change, ins_status = fetch_instrument(source)
            js_text = patch_instrument_in_js(js_text, ins_id, ins_price,
                                             ins_change, ins_status, False)
            instruments_json[ins_id] = {
                "currentPrice": ins_price,
                "changePercent": ins_change,
                "status": ins_status,
                "estimated": False,
            }
            ins_real += 1
            print("    [OK] {:<8} -> {:>18}  {:>9}  [{}]  ({})".format(
                ins_id, ins_price, ins_change, ins_status, source["ref"]))
        except Exception as e:
            # Fallback onesto: il valore esistente resta invariato, viene solo
            # marcato come non aggiornato (badge "stimato" in UI)
            js_text = patch_instrument_in_js(js_text, ins_id, estimated=True)
            instruments_json[ins_id] = {"estimated": True}
            ins_fallback += 1
            print("    [~~] {:<8} -> valore precedente mantenuto, marcato stimato ({})".format(
                ins_id, e))
        if source["type"] == "yahoo":
            time.sleep(0.5)  # 22 chiamate Yahoo/run: restiamo gentili

    print("\n[OK] Strumenti da fonte reale: {}/16 - non aggiornati (stimati): {}/16".format(
        ins_real, ins_fallback))

    # 4. Fetch real index values from Yahoo Finance (per-index fallback)
    print("\n[>>] Contatto Yahoo Finance per gli indici di mercato...")
    real_count, fallback_count = 0, 0
    indices_json = []
    index_names = {
        "SPX": "S&P 500", "IXIC": "Nasdaq Composite", "DJI": "Dow Jones",
        "FTSEMIB": "FTSE MIB", "GDAXI": "DAX 40", "N225": "Nikkei 225",
    }
    for symbol, ticker in YAHOO_TICKERS.items():
        try:
            price, prev_close = fetch_index_from_yahoo(ticker)
            change_pct = (price - prev_close) / prev_close * 100.0
            val_str    = "{:,.2f}".format(price)
            chg_str    = fmt_change(change_pct)
            idx_status = "positive" if change_pct >= 0 else "negative"
            estimated  = False
            real_count += 1
            print("    [OK] {:<10} -> {:>12}  {:>8}  [{}]  (fonte reale: {})".format(
                symbol, val_str, chg_str, idx_status, ticker))
        except Exception as e:
            val_str, chg_str, idx_status = random_drift(INDEX_BASES[symbol])
            estimated = True
            fallback_count += 1
            print("    [~~] {:<10} -> {:>12}  {:>8}  [{}]  FALLBACK STIMATO ({})".format(
                symbol, val_str, chg_str, idx_status, e))
        js_text = patch_index_in_js(js_text, symbol, val_str, chg_str, idx_status, estimated)
        indices_json.append({
            "symbol": symbol,
            "name": index_names.get(symbol, symbol),
            "value": val_str,
            "change": chg_str,
            "status": idx_status,
            "estimated": estimated,
        })

    print("\n[OK] Indici da fonte reale: {}/6 - in fallback stimato: {}/6".format(
        real_count, fallback_count))

    # 5. Save updated data.js
    with open(DATA_JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_text)

    print("\n[OK] data.js salvato ({:,} caratteri)".format(len(js_text)))

    # 6. Save market-data.json (fetched at runtime by the frontend)
    market_data = {
        "lastUpdate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "btc": btc_json,
        "indices": indices_json,
        "instruments": instruments_json,
    }
    with open(MARKET_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(market_data, f, ensure_ascii=False, indent=2)
    print("[OK] market-data.json salvato")
    print(sep)
    print("  Aggiornamento completato senza errori.")
    print(sep)


if __name__ == "__main__":
    main()
