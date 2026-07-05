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
from urllib import request
from urllib.parse import quote
from urllib.error import URLError, HTTPError
from datetime import datetime, timezone

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


def patch_btc_in_js(js_text, price_str, change_str, status):
    """
    Patches BTC currentPrice, changePercent and status in the instruments array.
    Strategy: split on the 'id: "btc"' anchor, then replace only the next
    occurrence of each field before the next 'id:' anchor.
    """
    anchor = 'id: "btc"'
    pos = js_text.find(anchor)
    if pos == -1:
        print("[!!] Anchor 'id: \"btc\"' non trovato in data.js.")
        return js_text

    # Find the next id: occurrence after the BTC block to bound our replacements
    next_id_pos = js_text.find('id: "', pos + len(anchor))
    if next_id_pos == -1:
        next_id_pos = len(js_text)

    before  = js_text[:pos]
    segment = js_text[pos:next_id_pos]
    after   = js_text[next_id_pos:]

    # Patch within the BTC segment only
    segment = re.sub(
        r'(currentPrice:\s*")[^"]*(")',
        lambda m: m.group(1) + price_str + m.group(2),
        segment, count=1
    )
    segment = re.sub(
        r'(changePercent:\s*")[^"]*(")',
        lambda m: m.group(1) + change_str + m.group(2),
        segment, count=1
    )
    # status field: only replace the first occurrence (not inside historicalYields)
    segment = re.sub(
        r'(status:\s*")[^"]*(")',
        lambda m: m.group(1) + status + m.group(2),
        segment, count=1
    )

    return before + segment + after


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
    js_text = patch_btc_in_js(js_text, price_str, change_str, btc_status)
    print("[OK] Blocco BTC aggiornato")

    btc_json = {
        "currentPrice": price_str,
        "changePercent": change_str,
        "status": btc_status,
        "estimated": btc_estimated,
    }

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
    }
    with open(MARKET_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(market_data, f, ensure_ascii=False, indent=2)
    print("[OK] market-data.json salvato")
    print(sep)
    print("  Aggiornamento completato senza errori.")
    print(sep)


if __name__ == "__main__":
    main()
