# TRENDS

Dashboard finanziaria con dati di mercato reali, simulatore di investimenti a interesse composto e quadro macro/geopolitico. Frontend vanilla (HTML/CSS/JS, ES6 modules), nessuna dipendenza di build.

**App live: https://vincybarila-cpu.github.io/trends/**

## Dati di mercato

- **Indici** (S&P 500, Nasdaq, Dow Jones, FTSE MIB, DAX, Nikkei): Yahoo Finance chart API
- **Bitcoin**: CoinGecko API
- **Macro** (CPI, PIL, disoccupazione, tassi Fed/BCE): FRED (St. Louis Fed) ed ECB Data Portal, aggiornati ogni settimana da [update_macro.py](update_macro.py)
- Aggiornamento automatico ogni ora via GitHub Actions ([update-data.yml](.github/workflows/update-data.yml)), che esegue [update_data.py](update_data.py) e committa `data.js` + `market-data.json`
- Il frontend fetcha `market-data.json` a runtime e mostra il timestamp di aggiornamento; se il fetch fallisce l'app usa i dati del bundle con un avviso
- Se una fonte non risponde, il singolo dato passa a un fallback simulato ed è etichettato **"stimato"** nell'interfaccia
- Le metriche di rischio (volatilità) sono calcolate dalla deviazione standard dei rendimenti storici, non assegnate a mano

## Avvio locale

```
avvia_trends.bat
```

Sincronizza i dati più recenti (`git pull`) e apre l'app su `http://127.0.0.1:8080` (richiede Node/npx).

> Nota: la copia di lavoro di questo progetto è `C:\Users\vincy\dev\trends`. La vecchia cartella in OneDrive (`Desktop\ANTIGRAVITY\trends`) è l'archivio pre-git e non va più modificata.

*I dati e le simulazioni hanno scopo esclusivamente educativo/dimostrativo e non costituiscono consulenza finanziaria.*
