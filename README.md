# TRENDS

Dashboard finanziaria con dati di mercato reali, simulatore di investimenti a interesse composto e quadro macro/geopolitico. Frontend vanilla (HTML/CSS/JS, ES6 modules), nessuna dipendenza di build.

**App live: https://vincybarila-cpu.github.io/trends/**

## Dati di mercato

| Dato | Fonte | Frequenza |
|---|---|---|
| Indici (S&P 500, Nasdaq, Dow, FTSE MIB, DAX, Nikkei) | Yahoo Finance chart API | oraria |
| Azioni ed ETF (AAPL, MSFT, NVDA, ASML, LVMH, KO, SPY, QQQ, VWCE, Water, GLD, AGGH) | Yahoo Finance chart API | oraria |
| Oro spot | Yahoo Finance (`GC=F`, future front-month COMEX) | oraria |
| Rendimenti Treasury USA 10a/2a | FRED (`DGS10`/`DGS2`) | giornaliera |
| Rendimento BTP 10a | FRED/OECD (`IRLTLT01ITM156N`) | **mensile, ~2 mesi di ritardo** |
| Bitcoin | CoinGecko API | oraria |
| Macro (CPI, PIL, disoccupazione, tassi Fed/BCE) | FRED ed ECB Data Portal ([update_macro.py](update_macro.py)) | settimanale |
- Aggiornamento automatico ogni ora via GitHub Actions ([update-data.yml](.github/workflows/update-data.yml)), che esegue [update_data.py](update_data.py) e committa `data.js` + `market-data.json`
- Il frontend fetcha `market-data.json` a runtime e mostra il timestamp di aggiornamento; se il fetch fallisce l'app usa i dati del bundle con un avviso
- Se una fonte non risponde: gli indici passano a un fallback simulato, i prezzi degli strumenti **mantengono l'ultimo valore reale noto** — in entrambi i casi il dato è etichettato **"stimato"** nell'interfaccia, mai spacciato per aggiornato
- Le metriche di rischio (volatilità) sono calcolate dalla deviazione standard dei rendimenti storici, non assegnate a mano

## Avvio locale

```
avvia_trends.bat
```

Sincronizza i dati più recenti (`git pull`) e apre l'app su `http://127.0.0.1:8080` (richiede Node/npx).

> Nota: la copia di lavoro di questo progetto è `C:\Users\vincy\dev\trends`. La vecchia cartella in OneDrive (`Desktop\ANTIGRAVITY\trends`) è l'archivio pre-git e non va più modificata.

*I dati e le simulazioni hanno scopo esclusivamente educativo/dimostrativo e non costituiscono consulenza finanziaria.*
