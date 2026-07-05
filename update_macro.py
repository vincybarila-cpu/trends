#!/usr/bin/env python3
"""
update_macro.py - TRENDS Macroeconomic Data Updater
====================================================
Aggiorna gli indicatori macroeconomici in data.js da fonti ufficiali gratuite
senza chiave API:

  - FRED (St. Louis Fed, endpoint pubblico fredgraph.csv):
      CPI USA (YoY calcolato da CPIAUCSL), PIL USA (A191RL1Q225SBEA),
      disoccupazione USA (UNRATE), range tassi Fed (DFEDTARL/DFEDTARU),
      inflazione PCE (PCEPI YoY)
  - ECB Data Portal (data-api.ecb.europa.eu, CSV pubblico):
      HICP Eurozona (YoY), tasso di rifinanziamento principale BCE,
      PIL Eurozona (crescita annua)

I campi qualitativi (stance, comment, calendario eventi) restano editoriali
e vanno aggiornati a mano: nessuna API gratuita li fornisce.

Pensato per un workflow settimanale (i dati macro escono a cadenza
mensile/trimestrale). Fallback: se una fonte non risponde, il valore
esistente in data.js resta invariato (per singolo indicatore).

Usage:
    python update_macro.py   (su Windows: py update_macro.py)

Requirements: Python 3.6+, stdlib only.
"""

import csv
import io
import re
import sys
import os
from urllib import request
from urllib.error import URLError, HTTPError
from datetime import datetime

DATA_JS_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.js")
REQUEST_TIMEOUT = 20

FRED_CSV_URL = "https://fred.stlouisfed.org/graph/fredgraph.csv?id={series}"
ECB_CSV_URL = ("https://data-api.ecb.europa.eu/service/data/{flow}/{key}"
               "?lastNObservations={n}&format=csvdata")


# --- FETCH HELPERS -------------------------------------------------------------

def http_get(url):
    req = request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "text/csv,*/*",
    })
    with request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
        return resp.read().decode("utf-8", errors="replace")


def fetch_fred(series_id):
    """Returns list of (date_str, float_value) for a FRED series, oldest first."""
    text = http_get(FRED_CSV_URL.format(series=series_id))
    rows = []
    for row in csv.reader(io.StringIO(text)):
        if len(row) < 2 or row[0] in ("DATE", "observation_date"):
            continue
        try:
            rows.append((row[0], float(row[1])))
        except ValueError:
            continue  # missing values are "." in FRED CSVs
    if not rows:
        raise ValueError("Serie FRED vuota: {}".format(series_id))
    return rows


def fetch_ecb(flow, key, n=14):
    """Returns list of (period_str, float_value) from ECB Data Portal, oldest first."""
    text = http_get(ECB_CSV_URL.format(flow=flow, key=key, n=n))
    reader = csv.reader(io.StringIO(text))
    header = next(reader)
    t_idx = header.index("TIME_PERIOD")
    v_idx = header.index("OBS_VALUE")
    rows = []
    for row in reader:
        try:
            rows.append((row[t_idx], float(row[v_idx])))
        except (ValueError, IndexError):
            continue
    if not rows:
        raise ValueError("Serie ECB vuota: {}/{}".format(flow, key))
    return rows


def yoy_percent(series):
    """From a monthly index level series, returns (latest_yoy, previous_yoy)."""
    if len(series) < 14:
        raise ValueError("Servono almeno 14 osservazioni per lo YoY")
    def yoy(i):
        return (series[i][1] - series[i - 12][1]) / series[i - 12][1] * 100.0
    return yoy(len(series) - 1), yoy(len(series) - 2)


# --- STATUS DERIVATI DAI NUMERI -------------------------------------------------

def inflation_status(v):
    if v <= 2.2: return "Vicina al target"
    if v <= 3.0: return "In moderazione"
    return "Elevata"

def gdp_status(v):
    if v < 0:   return "Contrazione"
    if v < 1.0: return "Crescita debole"
    if v < 2.5: return "Crescita moderata"
    return "Espansione solida"

def unemployment_status(v):
    if v < 4.5: return "Piena occupazione"
    if v < 6.0: return "Stabile"
    return "Mercato del lavoro debole"


# --- PATCHING data.js -----------------------------------------------------------

def patch_indicator(js_text, name_anchor, actual, previous, status):
    """Patches actual/previous/status of one entry in macro.indicators by name."""
    pattern = re.compile(
        r'(\{\s*name:\s*"' + re.escape(name_anchor) + r'"[^}]*?\})', re.DOTALL)
    match = pattern.search(js_text)
    if not match:
        print('    [!!] Indicatore "{}" non trovato in data.js'.format(name_anchor))
        return js_text
    original = match.group(0)
    patched = original
    patched = re.sub(r'(actual:\s*")[^"]*(")',
                     lambda m: m.group(1) + actual + m.group(2), patched, count=1)
    patched = re.sub(r'(previous:\s*")[^"]*(")',
                     lambda m: m.group(1) + previous + m.group(2), patched, count=1)
    patched = re.sub(r'(status:\s*")[^"]*(")',
                     lambda m: m.group(1) + status + m.group(2), patched, count=1)
    return js_text.replace(original, patched, 1)


def patch_central_bank(js_text, name_anchor, rate=None, inflation=None):
    """Patches rate and/or inflation of one entry in macro.centralBanks by name."""
    pattern = re.compile(
        r'(\{\s*name:\s*"' + re.escape(name_anchor) + r'".*?comment:.*?\})', re.DOTALL)
    match = pattern.search(js_text)
    if not match:
        print('    [!!] Banca centrale "{}" non trovata in data.js'.format(name_anchor))
        return js_text
    original = match.group(0)
    patched = original
    if rate is not None:
        patched = re.sub(r'(rate:\s*")[^"]*(")',
                         lambda m: m.group(1) + rate + m.group(2), patched, count=1)
    if inflation is not None:
        patched = re.sub(r'(inflation:\s*")[^"]*(")',
                         lambda m: m.group(1) + inflation + m.group(2), patched, count=1)
    return js_text.replace(original, patched, 1)


def fmt_pct(v):
    return "{:.1f}%".format(v)


# --- MAIN -----------------------------------------------------------------------

def main():
    sep = "=" * 60
    print(sep)
    print("  TRENDS - Macro Data Updater")
    print("  Eseguito: {}".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    print(sep)

    with open(DATA_JS_PATH, "r", encoding="utf-8") as f:
        js_text = f.read()

    ok_count, fail_count = 0, 0

    # --- USA (FRED) ---
    print("\n[>>] FRED (St. Louis Fed)...")

    try:
        cpi = fetch_fred("CPIAUCSL")
        latest, prev = yoy_percent(cpi)
        js_text = patch_indicator(js_text, "Inflazione USA (CPI)",
                                  fmt_pct(latest), fmt_pct(prev), inflation_status(latest))
        print("    [OK] CPI USA YoY: {} (prec. {})".format(fmt_pct(latest), fmt_pct(prev)))
        ok_count += 1
    except Exception as e:
        print("    [~~] CPI USA non aggiornato ({})".format(e)); fail_count += 1

    try:
        gdp = fetch_fred("A191RL1Q225SBEA")
        latest, prev = gdp[-1][1], gdp[-2][1]
        js_text = patch_indicator(js_text, "PIL USA (trim. annualizzato)",
                                  fmt_pct(latest), fmt_pct(prev), gdp_status(latest))
        print("    [OK] PIL USA: {} (prec. {})".format(fmt_pct(latest), fmt_pct(prev)))
        ok_count += 1
    except Exception as e:
        print("    [~~] PIL USA non aggiornato ({})".format(e)); fail_count += 1

    try:
        unrate = fetch_fred("UNRATE")
        latest, prev = unrate[-1][1], unrate[-2][1]
        js_text = patch_indicator(js_text, "Tasso Disoccupazione USA",
                                  fmt_pct(latest), fmt_pct(prev), unemployment_status(latest))
        print("    [OK] Disoccupazione USA: {} (prec. {})".format(fmt_pct(latest), fmt_pct(prev)))
        ok_count += 1
    except Exception as e:
        print("    [~~] Disoccupazione USA non aggiornata ({})".format(e)); fail_count += 1

    try:
        lower = fetch_fred("DFEDTARL")[-1][1]
        upper = fetch_fred("DFEDTARU")[-1][1]
        fed_rate = "{:.2f}% - {:.2f}%".format(lower, upper)
        pce = fetch_fred("PCEPI")
        pce_yoy, _ = yoy_percent(pce)
        js_text = patch_central_bank(js_text, "Federal Reserve (Fed)",
                                     rate=fed_rate,
                                     inflation="{} (PCE)".format(fmt_pct(pce_yoy)))
        print("    [OK] Tasso Fed: {} | PCE YoY: {}".format(fed_rate, fmt_pct(pce_yoy)))
        ok_count += 1
    except Exception as e:
        print("    [~~] Tassi Fed non aggiornati ({})".format(e)); fail_count += 1

    # --- Eurozona (ECB Data Portal) ---
    print("\n[>>] ECB Data Portal...")

    hicp_latest = None
    try:
        hicp = fetch_ecb("ICP", "M.U2.N.000000.4.ANR", n=2)
        hicp_latest, hicp_prev = hicp[-1][1], hicp[-2][1]
        js_text = patch_indicator(js_text, "Inflazione Eurozona (CPI)",
                                  fmt_pct(hicp_latest), fmt_pct(hicp_prev),
                                  inflation_status(hicp_latest))
        print("    [OK] HICP Eurozona YoY: {} (prec. {})".format(
            fmt_pct(hicp_latest), fmt_pct(hicp_prev)))
        ok_count += 1
    except Exception as e:
        print("    [~~] HICP Eurozona non aggiornato ({})".format(e)); fail_count += 1

    try:
        gdp_ea = fetch_ecb("MNA", "Q.Y.I9.W2.S1.S1.B.B1GQ._Z._Z._Z.EUR.LR.GY", n=2)
        latest, prev = gdp_ea[-1][1], gdp_ea[-2][1]
        js_text = patch_indicator(js_text, "PIL Eurozona (var. annua)",
                                  fmt_pct(latest), fmt_pct(prev), gdp_status(latest))
        print("    [OK] PIL Eurozona YoY: {} (prec. {})".format(fmt_pct(latest), fmt_pct(prev)))
        ok_count += 1
    except Exception as e:
        print("    [~~] PIL Eurozona non aggiornato ({})".format(e)); fail_count += 1

    try:
        mrr = fetch_ecb("FM", "B.U2.EUR.4F.KR.MRR_FR.LEV", n=1)[-1][1]
        ecb_kwargs = {"rate": "{:.2f}% (Rif. Principale)".format(mrr)}
        if hicp_latest is not None:
            ecb_kwargs["inflation"] = "{} (CPI)".format(fmt_pct(hicp_latest))
        js_text = patch_central_bank(js_text, "Banca Centrale Europea (BCE)", **ecb_kwargs)
        print("    [OK] Tasso BCE (rif. principale): {:.2f}%".format(mrr))
        ok_count += 1
    except Exception as e:
        print("    [~~] Tasso BCE non aggiornato ({})".format(e)); fail_count += 1

    with open(DATA_JS_PATH, "w", encoding="utf-8") as f:
        f.write(js_text)

    print("\n[OK] data.js salvato - indicatori aggiornati: {} - falliti: {}".format(
        ok_count, fail_count))
    print(sep)
    if fail_count > 0 and ok_count == 0:
        sys.exit(1)  # tutto fallito: segnala il problema al workflow


if __name__ == "__main__":
    main()
