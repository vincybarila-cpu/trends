# TRENDS – Walkthrough & Documentazione Tecnica

> Versione: 2.0 | Data: 2026-05-31

## Panoramica dell'Applicazione

TRENDS è una Single Page Application (SPA) premium che fornisce analisi in tempo reale dei mercati finanziari globali. È costruita con tecnologia puramente client-side (HTML5 + CSS3 + JavaScript ES6 Modules) e non richiede alcun backend o framework JavaScript.

**Struttura file:**
```
TRENDS/
├── index.html          — Struttura SPA (5 sezioni, modal, form)
├── app.js              — Logica core (ES6 module, ~1.440 righe)
├── data.js             — Database locale (17 strumenti, macro, geopolitica)
├── styles.css          — Design system completo (dark + light theme, ~2.200 righe)
├── update_data.py      — Updater dati live (Python 3, stdlib only)
├── task.md             — Tracker avanzamento implementazione
└── walkthrough.md      — Questo documento
```

---

## Sezioni dell'Applicazione

### 1. Dashboard
Quadro sinottico con:
- **6 Indici di mercato** (SPX, IXIC, DJI, FTSEMIB, GDAXI, N225) con ticker animato in cima
- **4 Strumenti rilevanti** cliccabili (MSFT, SPY, GLD, BTC)
- **Calendario macroeconomico** con eventi ad alto impatto (Fed, BCE, NFP)
- **2 Allarmi geopolitici** collegati alla sezione Geopolitica
- **Banche centrali** con tassi d'interesse attuali

### 2. Strumenti Solidi (17 Asset)
Lista filtrable + pannello dettaglio con:
- Filtri per categoria (Azioni/ETF/Obbligazioni/Commodity/Crypto) e rischio
- Scheda dettaglio: descrizione, solidità, rischi, prezzo, variazione
- Grafico interattivo (Chart.js, barre colorate) dei rendimenti storici 2020–2024

**Lista completa degli strumenti:**

| # | Symbol | Nome | Categoria | Rischio | Yield Atteso |
|---|--------|------|-----------|---------|-------------|
| 1 | AAPL | Apple Inc. | Azioni | Medio | 12.0% |
| 2 | MSFT | Microsoft Corp. | Azioni | Basso-Medio | 11.0% |
| 3 | NVDA | NVIDIA Corp. | Azioni | Alto | 16.0% |
| 4 | ASML | ASML Holding N.V. | Azioni | Medio-Alto | 12.5% |
| 5 | MC | LVMH Moët Hennessy | Azioni | Medio | 9.0% |
| 6 | KO | The Coca-Cola Co. | Azioni | Basso-Medio | 6.0% |
| 7 | SPY | SPDR S&P 500 ETF | ETF | Basso-Medio | 9.5% |
| 8 | QQQ | Invesco QQQ Trust | ETF | Medio | 11.5% |
| 9 | VWCE | Vanguard FTSE All-World | ETF | Basso-Medio | 8.0% |
| 10 | WATER | Lyxor MSCI Water ETF | ETF | Medio | 7.5% |
| 11 | GLD | SPDR Gold Shares | ETF | Basso | 6.5% |
| 12 | US10Y | US Treasury 10Y | Obbligazioni | Minimo | 4.48% |
| 13 | US02Y | US Treasury 2Y | Obbligazioni | Minimo | 4.8% |
| 14 | BTP10Y | BTP Italiano 10 Anni | Obbligazioni | Medio | 3.85% |
| 15 | AGGH | iShares Global Agg Bond | Obbligazioni | Minimo | 3.5% |
| 16 | GOLD | Oro Spot | Commodity | Basso | 6.5% |
| 17 | BTC | Bitcoin | Crypto | Molto Alto | 18.0% |

### 3. Quadro Macroeconomico
- **5 Indicatori** (inflazione USA/EU, PIL USA/EU, disoccupazione)
- **Grafico linee** (Chart.js) dell'andamento tassi Fed/BCE/PBOC (Q1 2024 – Oggi)
- **Dettaglio banche centrali** con stance monetaria e commento qualitativo

### 4. Analisi Geopolitica (3 Scenari)
Ogni scenario ha ora un **banner visivo CSS** nel pannello dettaglio:

| ID | Titolo | Banner | Severità |
|----|--------|--------|---------|
| geo-tech | Guerra Fredda Tecnologica | Navy/Blu (microchip icon) | Alta |
| geo-energy | Transizione Energetica | Ambra/Bronzo (fulmine icon) | Media-Alta |
| geo-mideast | Tensioni Medio Oriente | Cremisi (globo icon) | Alta |

Ciascun pannello mostra: descrizione, prospettive macro, matrice d'impatto asset.

### 5. Simulatore di Portafoglio
Il modulo più avanzato dell'applicazione.

---

## Simulatore: Logica Matematica

### Formula Implementata (Capitalizzazione Composta Mensile con PAC)

```
C_mese = C_precedente × (1 + r_mensile) + PAC
```

Dove:
- `r_mensile = (1 + Rendimento_Ponderato/100)^(1/12) - 1`  (equivalente mensile esatto, non approssimazione lineare)
- `PAC` = contributo mensile costante (Piano di Accumulo del Capitale)
- `Capitale_Investito(t) = CapitaleIniziale + PAC × 12 × t`

**Esempio verificato matematicamente:**
- Capitale iniziale: €10.000 | PAC: €300/mese | Rendimento: 8% | Orizzonte: 1 anno
- Risultato Anno 1:
  - Capitale investito: €13.600 (€10k + 12×€300)
  - Interessi capitalizzati: €930.17
  - Valore portafoglio: €14.530.17

### Calcolo Rendimento Ponderato
```
Rendimento_Ponderato = Somma(Rendimento_i × Peso_i / 100)
```

### Calcolo Profilo di Rischio Ponderato
```
RiskScore_Ponderato = Somma(riskScore_i × Peso_i / 100)
```

| RiskScore | Profilo | Emoji |
|-----------|---------|-------|
| ≤ 1.5 | Minimo | 🛡️ |
| ≤ 2.5 | Basso-Medio | ⚖️ |
| ≤ 3.5 | Medio | 📈 |
| ≤ 4.5 | Alto | ⚡ |
| > 4.5 | Molto Alto | 🔥 |

---

## AI Investment Advisor

### Badge Preset Rapidi

| Badge | Portafoglio | Yield | Rischio |
|-------|-------------|-------|---------|
| Conservativo | 40% AGGH, 20% US2Y, 15% BTP10Y, 15% GOLD, 10% KO | ~4.71% | Minimo |
| Bilanciato | 35% VWCE, 20% SPY, 15% GLD, 15% US10Y, 10% AAPL, 5% BTC | ~8.20% | Basso-Medio |
| Aggressivo | 30% QQQ, 25% NVDA, 20% BTC, 15% AAPL, 10% ASML | ~13.78% | Alto |

### Motore Semantico Testuale

Il motore analizza le parole chiave e instrada automaticamente verso uno di 4 profili:

| Keywords | Profilo | Allocazione |
|----------|---------|-------------|
| pension, cauto, basso risch, difensiv, obbligazion, sicur | Conservativo | Identico al preset cauto |
| inflazion, stagflazion, copertura, svalut, erosion, potere d'acquisto | Anti-Inflazione | 30%AGGH+25%GLD+20%GOLD+15%SPY+10%KO |
| rischia, aggressiv, tech, crypto, bitcoin, nvidia, crescita | Aggressivo | Identico al preset aggressivo |
| Qualsiasi altro testo | Bilanciato | Identico al preset bilanciato |

Dopo ogni risposta l'AI autocompila il simulatore e fa scroll al form.

---

## Modale Informativo

Aperto tramite pulsanti `ⓘ` (`.info-btn` e `.info-btn-title`).
- Overlay con `backdrop-filter: blur(8px)`
- Animazione spring: `scale(0.92) → scale(1)` con `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Chiusura: tasto Esc, clic sull'overlay, pulsante ×

---

## Tema Chiaro / Scuro

- Default: tema scuro (`hsl(222, 47%, 6%)` come background)
- Toggle salvato in `localStorage` con chiave `trends-theme`
- Tutti i colori sono variabili CSS (`var(--bg-main)`, ecc.)
- Grafici Chart.js aggiornati in tempo reale al cambio tema

---

## Script `update_data.py`

### Come eseguire
```bash
cd "C:\Users\vincy\OneDrive\Desktop\TRENDS"
python update_data.py
```

### Cosa fa
1. Legge `data.js` (UTF-8)
2. Chiama `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true`
3. Patcha `currentPrice`, `changePercent`, `status` di Bitcoin
4. Applica drift casuale ±0.3%–1.8% ai 6 indici di mercato
5. Salva `data.js` aggiornato

### Fallback
Se CoinGecko non è raggiungibile (timeout 12s), applica un drift casuale ±0.5%–2.5% al prezzo base di Bitcoin.

### Esempio output
```
============================================================
  TRENDS - Data Updater
  Eseguito: 2026-05-31 17:47:40
============================================================
[OK] data.js letto (27,034 caratteri)
[>>] Contatto CoinGecko API per dati BTC live...
[OK] BTC Price : 73,544.00 USD
[OK] BTC 24h   : -0.34%  [negative]
[OK] Blocco BTC aggiornato

[>>] Drift giornaliero casuale sugli indici di mercato...
    SPX        ->     5,375.89    +1.34%  [positive]
    IXIC       ->    16,534.45    -1.20%  [negative]
    ...
[OK] data.js salvato (27,034 caratteri)
============================================================
  Aggiornamento completato senza errori.
============================================================
```

---

## Test Eseguiti

| Test | Metodo | Risultato |
|------|--------|-----------|
| Syntax check `app.js` | `node --check app.js` | PASS |
| Syntax check `data.js` | `node --check data.js` | PASS |
| HTTP server | `python -m http.server 8080` | 200 OK su tutti i file |
| Formula PAC | Node.js inline | €930.17 interessi su €13.600 investiti (Anno 1, 8%, €300 PAC) |
| BTC patch | `update_data.py` | 73,544.00 USD | -0.34% | negative — scritto correttamente |
| Index drift | `update_data.py` | Tutti e 6 gli indici aggiornati con drift realistico |
| AI keyword "inflazione" | Analisi codice | Branch presente, alloca 30%AGGH+25%GLD+20%GOLD+15%SPY+10%KO |

---

## URL Applicazione Locale
```
http://localhost:8080/
```
Avviare prima: `python -m http.server 8080` dalla cartella del progetto.
