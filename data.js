/**
 * Database locale strutturato per l'applicazione TRENDS.
 * Contiene informazioni su strumenti finanziari solidi, dati macroeconomici e scenari geopolitici.
 * Tutti gli strumenti includono ora expectedYield (rendimento annuo atteso %) e riskScore (da 1 a 5).
 */

export const TRENDS_DATA = {
  indices: [
    { symbol: "SPX", name: "S&P 500", value: "7,575.39", change: "+1.24%", status: "positive", estimated: false },
    { symbol: "IXIC", name: "Nasdaq Composite", value: "26,281.61", change: "+1.59%", status: "positive", estimated: false },
    { symbol: "DJI", name: "Dow Jones", value: "52,637.01", change: "+0.55%", status: "positive", estimated: false },
    { symbol: "FTSEMIB", name: "FTSE MIB", value: "52,614.17", change: "+1.54%", status: "positive", estimated: false },
    { symbol: "GDAXI", name: "DAX 40", value: "25,067.09", change: "+0.68%", status: "positive", estimated: false },
    { symbol: "N225", name: "Nikkei 225", value: "67,225.92", change: "-1.94%", status: "negative", estimated: false }
  ],

  instruments: [
    {
      id: "aapl",
      symbol: "AAPL",
      name: "Apple Inc.",
      category: "Azioni",
      subcategory: "Tecnologia / Consumer Tech",
      risk: "Medio",
      riskScore: 3,
      expectedYield: 12.0,
      description: "Leader globale nella tecnologia di consumo, con un ecosistema hardware-software estremamente fidelizzato e margini operativi elevati.",
      solidRationale: "Generazione di cassa (Free Cash Flow) straordinaria, brand premium con forte potere di determinazione dei prezzi (pricing power) e continuo sviluppo dei servizi ad abbonamento ad alto margine.",
      risks: "Dipendenza dalle catene di approvvigionamento asiatiche, rallentamento delle vendite in Cina e scrutinio antitrust globale.",
      currentPrice: "315.32 USD",
      changePercent: "+0.62%",
      status: "positive",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 81.8 },
        { year: "2021", yield: 33.8 },
        { year: "2022", yield: -26.8 },
        { year: "2023", yield: 48.2 },
        { year: "2024", yield: 20.5 }
      ]
    },
    {
      id: "msft",
      symbol: "MSFT",
      name: "Microsoft Corporation",
      category: "Azioni",
      subcategory: "Tecnologia / Cloud & AI",
      risk: "Basso-Medio",
      riskScore: 2,
      expectedYield: 11.0,
      description: "Gigante tecnologico diversificato attivo nei sistemi operativi, software per la produttività aziendale, cloud computing (Azure) e intelligenza artificiale.",
      solidRationale: "Monopolio di fatto nel software aziendale (Office), infrastruttura cloud in fortissima crescita e leadership strategica nell'intelligenza artificiale grazie alla partnership con OpenAI.",
      risks: "Valutazioni di mercato storicamente elevate, forte concorrenza nel cloud da parte di AWS e Google, e requisiti crescenti di spesa in conto capitale (CapEx) per i data center.",
      currentPrice: "385.10 USD",
      changePercent: "+0.46%",
      status: "positive",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 42.5 },
        { year: "2021", yield: 51.2 },
        { year: "2022", yield: -28.0 },
        { year: "2023", yield: 56.8 },
        { year: "2024", yield: 18.2 }
      ]
    },
    {
      id: "nvda",
      symbol: "NVDA",
      name: "NVIDIA Corporation",
      category: "Azioni",
      subcategory: "Semiconduttori / AI",
      risk: "Alto",
      riskScore: 5,
      expectedYield: 16.0,
      description: "Pioniere e leader indiscusso delle GPU (Graphics Processing Units) e dell'architettura hardware/software CUDA, essenziali per il deep learning e l'intelligenza artificiale generativa.",
      solidRationale: "Monopolio tecnologico (oltre l'80% di quota di mercato nei chip per AI), barriera d'ingresso insormontabile grazie all'ecosistema software CUDA e domanda globale di elaborazione dati senza precedenti.",
      risks: "Ciclicità intrinseca del settore dei semiconduttori, rischi geopolitici legati a Taiwan (TSMC produce i chip fisici) e valutazioni di mercato estremamente volatili.",
      currentPrice: "210.96 USD",
      changePercent: "+3.35%",
      status: "positive",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 121.9 },
        { year: "2021", yield: 125.3 },
        { year: "2022", yield: -50.3 },
        { year: "2023", yield: 238.9 },
        { year: "2024", yield: 145.0 }
      ]
    },
    {
      id: "asml",
      symbol: "ASML",
      name: "ASML Holding N.V.",
      category: "Azioni",
      subcategory: "Semiconduttori / Macchine Litografiche",
      risk: "Medio-Alto",
      riskScore: 4,
      expectedYield: 12.5,
      description: "Monopolista mondiale dei macchinari per litografia a ultravioletti estremi (EUV), l'unico metodo in grado di stampare i chip più piccoli e avanzati al mondo.",
      solidRationale: "Monopolio tecnologico assoluto nel cuore dell'industria globale dei semiconduttori. Senza ASML, la crescita dell'AI e dei processori di ultima generazione è tecnicamente impossibile.",
      risks: "Elevate tensioni commerciali USA-Cina che limitano l'export in Cina (un mercato enorme) ed elevata ciclicità del CapEx dei produttori di chip.",
      currentPrice: "1,569.00 EUR",
      changePercent: "-2.11%",
      status: "negative",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 51.5 },
        { year: "2021", yield: 76.2 },
        { year: "2022", yield: -31.3 },
        { year: "2023", yield: 37.8 },
        { year: "2024", yield: 28.5 }
      ]
    },
    {
      id: "lvmh",
      symbol: "MC",
      name: "LVMH Moët Hennessy",
      category: "Azioni",
      subcategory: "Beni di Consumo / Lusso",
      risk: "Medio",
      riskScore: 3,
      expectedYield: 9.0,
      description: "Conglomerato leader mondiale del lusso, detentore di oltre 75 marchi storici (Louis Vuitton, Christian Dior, Fendi, Bulgari, Moët & Chandon).",
      solidRationale: "Pricing power imbattibile dovuto all'eredità dei marchi, che consente di mantenere margini operativi stellari anche in scenari di forte inflazione o rallentamento economico.",
      risks: "Sensibilità alla riduzione del turismo di fascia alta e all'andamento della ricchezza della classe media emergente in Asia (soprattutto Cina).",
      currentPrice: "489.90 EUR",
      changePercent: "-0.62%",
      status: "negative",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 23.4 },
        { year: "2021", yield: 41.2 },
        { year: "2022", yield: -6.5 },
        { year: "2023", yield: 7.9 },
        { year: "2024", yield: 11.2 }
      ]
    },
    {
      id: "ko",
      symbol: "KO",
      name: "The Coca-Cola Company",
      category: "Azioni",
      subcategory: "Beni di Consumo / Alimentare Difensivo",
      risk: "Basso-Medio",
      riskScore: 2,
      expectedYield: 6.0,
      description: "Gigante globale delle bevande analcoliche, con una delle reti di distribuzione fisica più capillari del pianeta e un brand riconosciuto universalmente.",
      solidRationale: "Titolo difensivo per eccellenza. Dividendi costanti aumentati per oltre 60 anni consecutivi (Dividend King). Domanda anelastica indipendentemente dalla congiuntura economica.",
      risks: "Cambiamento delle abitudini dei consumatori verso opzioni più salutari e impatto di imposte specifiche sulle bevande zuccherate.",
      currentPrice: "83.49 USD",
      changePercent: "+0.11%",
      status: "positive",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 2.5 },
        { year: "2021", yield: 11.4 },
        { year: "2022", yield: 10.6 },
        { year: "2023", yield: 1.8 },
        { year: "2024", yield: 7.5 }
      ]
    },
    {
      id: "spy",
      symbol: "SPY",
      name: "SPDR S&P 500 ETF",
      category: "ETF",
      subcategory: "Azionario Globale / USA",
      risk: "Basso-Medio",
      riskScore: 2,
      expectedYield: 9.5,
      description: "L'ETF più grande e liquido al mondo, che replica passivamente la performance dell'indice S&P 500, coprendo le 500 principali società statunitensi a grande capitalizzazione.",
      solidRationale: "Diversificazione immediata su 500 tra le migliori aziende del mondo. Costi di gestione estremamente contenuti (Expense Ratio: 0.09%) e liquidità imbattibile.",
      risks: "Esposizione totale all'economia e al mercato azionario statunitense, forte concentrazione attuale sui titoli tecnologici (i cosiddetti Magnifici Sette).",
      currentPrice: "754.95 USD",
      changePercent: "+1.28%",
      status: "positive",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 18.4 },
        { year: "2021", yield: 28.7 },
        { year: "2022", yield: -18.1 },
        { year: "2023", yield: 26.2 },
        { year: "2024", yield: 12.8 }
      ]
    },
    {
      id: "qqq",
      symbol: "QQQ",
      name: "Invesco QQQ Trust",
      category: "ETF",
      subcategory: "Azionario Settoriale / Tech",
      risk: "Medio",
      riskScore: 3,
      expectedYield: 11.5,
      description: "ETF che replica l'indice Nasdaq-100, focalizzato sulle 100 più grandi società non finanziarie quotate al Nasdaq, con forte prevalenza di tecnologia, servizi di comunicazione e beni voluttuari.",
      solidRationale: "Ideale per esporsi ai motori dell'innovazione globale (Apple, Microsoft, NVIDIA, Amazon, Alphabet, Meta, Tesla) in un unico strumento altamente liquido.",
      risks: "Elevata volatilità e sensibilità ai tassi di interesse; sovraesposizione settoriale alla tecnologia che può soffrire in periodi di alta inflazione.",
      currentPrice: "725.51 USD",
      changePercent: "+1.98%",
      status: "positive",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 48.6 },
        { year: "2021", yield: 27.4 },
        { year: "2022", yield: -32.6 },
        { year: "2023", yield: 54.9 },
        { year: "2024", yield: 15.3 }
      ]
    },
    {
      id: "vwce",
      symbol: "VWCE",
      name: "Vanguard FTSE All-World UCITS ETF",
      category: "ETF",
      subcategory: "Azionario Globale / Diversificato",
      risk: "Basso-Medio",
      riskScore: 2,
      expectedYield: 8.0,
      description: "ETF che replica l'indice FTSE All-World, investendo in oltre 3.600 società a grande e media capitalizzazione sia in mercati sviluppati che emergenti in tutto il mondo.",
      solidRationale: "La quintessenza dell'investimento passivo. Copre oltre il 90% della capitalizzazione azionaria mondiale in un unico strumento. Riduce al minimo il rischio specifico di singole nazioni o settori.",
      risks: "Sebbene sia globale, rimane esposto per oltre il 60% agli Stati Uniti. Risente dell'andamento macroeconomico globale complessivo.",
      currentPrice: "166.14 EUR",
      changePercent: "+1.44%",
      status: "positive",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 6.4 },
        { year: "2021", yield: 27.8 },
        { year: "2022", yield: -13.0 },
        { year: "2023", yield: 17.6 },
        { year: "2024", yield: 9.8 }
      ]
    },
    {
      id: "water",
      symbol: "WATER",
      name: "Amundi MSCI Water UCITS ETF",
      category: "ETF",
      subcategory: "Azionario Tematico / Sostenibilità",
      risk: "Medio",
      riskScore: 3,
      expectedYield: 7.5,
      description: "ETF tematico che replica le 30 principali aziende mondiali attive nelle infrastrutture idriche, trattamento dell'acqua, depurazione e distribuzione.",
      solidRationale: "Investimento in una risorsa di fondamentale importanza, caratterizzata da una scarsità strutturale legata al cambiamento climatico e all'urbanizzazione. Profilo difensivo-industriale solido.",
      risks: "Forte esposizione alla regolamentazione pubblica locale dei servizi di pubblica utilità (utilities) e alla ciclicità degli investimenti infrastrutturali.",
      currentPrice: "70.39 EUR",
      changePercent: "+0.87%",
      status: "positive",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 5.8 },
        { year: "2021", yield: 38.6 },
        { year: "2022", yield: -19.4 },
        { year: "2023", yield: 11.2 },
        { year: "2024", yield: 8.5 }
      ]
    },
    {
      id: "gld",
      symbol: "GLD",
      name: "SPDR Gold Shares",
      category: "ETF",
      subcategory: "Materie Prime / Oro",
      risk: "Basso",
      riskScore: 2,
      expectedYield: 6.5,
      description: "ETF con replica fisica dell'oro monetario, depositato in caveau protetti. Ogni quota simula la detenzione di circa un decimo di oncia d'oro.",
      solidRationale: "Strumento di protezione patrimoniale ideale contro l'inflazione sistemica, la svalutazione monetaria e l'incertezza geopolitica globale.",
      risks: "Non distribuisce dividendi o interessi (costo opportunità elevato in contesti di tassi reali positivi) e fluttua in base al dollaro USA.",
      currentPrice: "377.01 USD",
      changePercent: "+0.68%",
      status: "positive",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 23.8 },
        { year: "2021", yield: -4.2 },
        { year: "2022", yield: -0.8 },
        { year: "2023", yield: 12.8 },
        { year: "2024", yield: 16.5 }
      ]
    },
    {
      id: "us10y",
      symbol: "US10Y",
      name: "US Treasury 10-Year Note",
      category: "Obbligazioni",
      subcategory: "Titoli di Stato / USA",
      risk: "Minimo",
      riskScore: 1,
      expectedYield: 4.48,
      description: "Titolo di debito emesso dal governo degli Stati Uniti con scadenza a 10 anni. Rappresenta il benchmark dei tassi d'interesse mondiali e l'asset privo di rischio (risk-free) per eccellenza.",
      solidRationale: "Garanzia totale di solvibilità (il governo USA ha la capacità teoricamente illimitata di stampare dollari). Offre un flusso di cassa certo (cedole semestrali).",
      risks: "Rischio tasso (se i tassi d'interesse salgono, il prezzo dell'obbligazione scende sul mercato secondario) e rischio di erosione del potere d'acquisto da inflazione elevata.",
      currentPrice: "4.54% (Rendimento)",
      changePercent: "-0.02 pt",
      status: "negative",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 0.93 },
        { year: "2021", yield: 1.51 },
        { year: "2022", yield: 3.88 },
        { year: "2023", yield: 3.88 },
        { year: "2024", yield: 4.48 }
      ]
    },
    {
      id: "us2y",
      symbol: "US02Y",
      name: "US Treasury 2-Year Note",
      category: "Obbligazioni",
      subcategory: "Titoli di Stato / USA a Breve Termine",
      risk: "Minimo",
      riskScore: 1,
      expectedYield: 4.8,
      description: "Titolo di debito emesso dal governo degli Stati Uniti con scadenza a 2 anni. Molto sensibile alle decisioni di politica monetaria immediata della Federal Reserve.",
      solidRationale: "Rischio di fluttuazione del prezzo sul mercato secondario estremamente ridotto rispetto al decennale a causa della brevissima durata (duration). Ideale per parcheggiare la liquidità con rendimenti elevati.",
      risks: "Rischio di reinvestimento (alla scadenza, se i tassi sono scesi, si dovrà reinvestire a rendimenti inferiori) e imposte sull'inflazione reale.",
      currentPrice: "4.16% (Rendimento)",
      changePercent: "-0.05 pt",
      status: "negative",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 0.12 },
        { year: "2021", yield: 0.73 },
        { year: "2022", yield: 4.43 },
        { year: "2023", yield: 4.25 },
        { year: "2024", yield: 4.82 }
      ]
    },
    {
      // Rendimento da serie mensile OECD via FRED (ritardo ~2 mesi)
      id: "btp10y",
      symbol: "BTP10Y",
      name: "BTP Italiano 10 Anni",
      category: "Obbligazioni",
      subcategory: "Titoli di Stato / Eurozona",
      risk: "Medio",
      riskScore: 2,
      expectedYield: 3.85,
      description: "Buono del Tesoro Poliennale emesso dalla Repubblica Italiana con durata di 10 anni. È il termometro del debito pubblico sovrano dell'Europa meridionale.",
      solidRationale: "Rendimenti cedolari storicamente attraenti rispetto ai titoli core europei (come il Bund tedesco), sostenuti implicitamente dai meccanismi di protezione della BCE (TPI, PEPP).",
      risks: "Rischio emittente dovuto all'elevato rapporto debito/PIL dell'Italia e sensibilità all'allargamento dello spread rispetto alla Germania nei momenti di panico finanziario.",
      currentPrice: "3.82% (Rendimento)",
      changePercent: "+0.08 pt",
      status: "positive",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 0.54 },
        { year: "2021", yield: 1.17 },
        { year: "2022", yield: 4.70 },
        { year: "2023", yield: 3.70 },
        { year: "2024", yield: 3.85 }
      ]
    },
    {
      id: "aggh",
      symbol: "AGGH",
      name: "iShares Core Global Aggregate Bond UCITS ETF",
      category: "Obbligazioni",
      subcategory: "Obbligazionario Globale / Diversificato",
      risk: "Minimo",
      riskScore: 1,
      expectedYield: 3.5,
      description: "ETF obbligazionario globale a replica fisica con copertura valutaria in Euro (EUR Hedged). Investe in oltre 10.000 obbligazioni investment grade (statali e societarie) di tutto il mondo.",
      solidRationale: "Rappresenta l'ancora di stabilità per eccellenza in un portafoglio bilanciato classica (formula 60/40). Diversificazione totale del debito con rischio valutario annullato tramite l'hedging.",
      risks: "Sensibilità generalizzata all'aumento globale coordinato dei tassi di interesse e rendimenti reali negativi in presenza di alta inflazione.",
      currentPrice: "4.92 EUR",
      changePercent: "+0.33%",
      status: "positive",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 4.2 },
        { year: "2021", yield: -2.8 },
        { year: "2022", yield: -13.5 },
        { year: "2023", yield: 5.2 },
        { year: "2024", yield: 3.2 }
      ]
    },
    {
      id: "gold",
      symbol: "GOLD",
      name: "Oro (Spot)",
      category: "Commodity",
      subcategory: "Metalli Preziosi",
      risk: "Basso",
      riskScore: 2,
      expectedYield: 6.5,
      description: "Materia prima metallica di riferimento. Da millenni rappresenta lo standard storico del valore tangibile ed è la riserva monetaria delle banche centrali di tutto il pianeta.",
      solidRationale: "Assenza di rischio di controparte. Protegge nei periodi di gravi tensioni sistemiche ed geopolitiche (stagflazione, conflitti armati, crisi bancarie).",
      risks: "Costi fisici di stoccaggio e assicurazione per i possessori di oro fisico; forte correlazione inversa con i rendimenti reali dei titoli di Stato statunitensi.",
      currentPrice: "4,067.80 USD/oz",
      changePercent: "-1.12%",
      status: "negative",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 24.6 },
        { year: "2021", yield: -3.6 },
        { year: "2022", yield: -0.3 },
        { year: "2023", yield: 13.1 },
        { year: "2024", yield: 15.8 }
      ]
    },
    {
      id: "btc",
      symbol: "BTC",
      name: "Bitcoin",
      category: "Crypto",
      subcategory: "Valute Digitali / Riserva",
      risk: "Molto Alto",
      riskScore: 5,
      expectedYield: 18.0,
      description: "La prima e più grande criptovaluta decentralizzata basata su blockchain. Caratterizzata da una scarsità algoritmica programmata a 21 milioni di unità totali.",
      solidRationale: "Adozione istituzionale crescente (approvazione di ETF spot globali), proprietà tangibili di oro digitale (scarsità matematica, trasferibilità globale senza intermediari) e indipendenza dai sistemi bancari centrali.",
      risks: "Estrema volatilità dei prezzi, incertezze normative e regolatorie globali, e potenziale impatto ambientale dei consumi del protocollo Proof of Work.",
      currentPrice: "62,773.00 USD",
      changePercent: "-2.12%",
      status: "negative",
      estimated: false,
      historicalYields: [
        { year: "2020", yield: 302.8 },
        { year: "2021", yield: 57.3 },
        { year: "2022", yield: -64.2 },
        { year: "2023", yield: 155.8 },
        { year: "2024", yield: 60.1 }
      ]
    }
  ],

  macro: {
    // rate/inflation e indicators[].actual/previous/status sono aggiornati
    // automaticamente da update_macro.py (FRED/ECB, workflow settimanale).
    // stance, comment e calendar sono contenuti editoriali manuali.
    centralBanks: [
      {
        name: "Federal Reserve (Fed)",
        region: "Stati Uniti",
        rate: "3.50% - 3.75%",
        inflation: "4.1% (PCE)",
        inflationTarget: "2.0%",
        stance: "In allentamento graduale (Data-dependent)",
        comment: "Dopo il picco restrittivo del 2023-2024, la Fed ha avviato un ciclo di riduzione graduale dei tassi. Il ritmo dei tagli resta legato ai dati su inflazione dei servizi e mercato del lavoro."
      },
      {
        name: "Banca Centrale Europea (BCE)",
        region: "Eurozona",
        rate: "2.40% (Rif. Principale)",
        inflation: "1.9% (CPI)",
        inflationTarget: "2.0%",
        stance: "Neutrale / Ciclo di tagli avanzato",
        comment: "Con l'inflazione ormai convergente all'obiettivo del 2%, la BCE ha riportato i tassi verso livelli neutrali. Le prossime mosse dipenderanno dalla dinamica salariale e dalla crescita, ancora modesta, dell'Eurozona."
      },
      {
        name: "People's Bank of China (PBOC)",
        region: "Cina",
        rate: "3.00% (LPR a 1 anno)",
        inflation: "0.3% (CPI)",
        inflationTarget: "3.0%",
        stance: "Espansivo / Stimolo monetario",
        comment: "A differenza dell'Occidente, la PBOC contrasta spinte deflazionistiche ed una crisi profonda del settore immobiliare, riducendo i requisiti di riserva delle banche e tagliando i tassi chiave per stimolare il credito."
      }
    ],
    indicators: [
      { name: "Inflazione USA (CPI)", actual: "4.3%", previous: "3.9%", status: "Elevata" },
      { name: "PIL USA (trim. annualizzato)", actual: "2.1%", previous: "0.5%", status: "Crescita moderata" },
      { name: "Tasso Disoccupazione USA", actual: "4.2%", previous: "4.3%", status: "Piena occupazione" },
      { name: "Inflazione Eurozona (CPI)", actual: "1.9%", previous: "2.1%", status: "Vicina al target" },
      { name: "PIL Eurozona (var. annua)", actual: "0.3%", previous: "1.2%", status: "Crescita debole" }
    ],
    calendar: [
      { date: "07 Agosto 2026", event: "USA Non-Farm Payrolls (Dati Occupazione Luglio)", impact: "Alto", expectation: "—" },
      { date: "12 Agosto 2026", event: "USA CPI (Dati Inflazione Luglio)", impact: "Massimo", expectation: "—" },
      { date: "15-16 Settembre 2026", event: "Decisione sui Tassi d'Interesse della Fed (FOMC)", impact: "Massimo", expectation: "—" }
    ]
  },

  geopolitics: {
    scenarios: [
      {
        id: "geo-tech",
        title: "Guerra Fredda Tecnologica & Catene di Approvvigionamento",
        severity: "Alta",
        description: "Competizione strategica accesa tra Stati Uniti e Cina sull'accesso alla proprietà intellettuale critica, con focus sui semiconduttori avanzati, intelligenza artificiale e tecnologie di sicurezza nazionale. Questa dinamica si traduce in restrizioni commerciali, tariffe e sussidi nazionali massicci (CHIPS Act).",
        outlook: "La frammentazione tecnologica costringe le multinazionali a riorganizzare la produzione (nearshoring/friendshoring), aumentando strutturalmente i costi di capitale ed escludendo potenzialmente mercati di sbocco chiave.",
        affectedAssets: [
          { name: "Azioni Semiconduttori (es. NVIDIA, ASML)", impact: "Misto / Volatile", effect: "Positivo per gli ingenti sussidi governativi occidentali, ma negativo per i divieti di esportazione nel mercato cinese che riducono i volumi di vendita." },
          { name: "Titoli di Stato USA (US10Y)", impact: "Negativo marginale", effect: "Le barriere commerciali e la duplicazione delle catene produttive generano spinte inflazionistiche strutturali a lungo termine, costringendo i rendimenti ad attestarsi su livelli più alti." },
          { name: "Criptovalute (Bitcoin)", impact: "Neutrale / Positivo", effect: "La crescente restrizione alla libera circolazione dei capitali e il controllo statale aumentano l'attrattività di sistemi monetari decentralizzati e non censurabili." }
        ]
      },
      {
        id: "geo-energy",
        title: "Transizione Energetica & Competizione per le Risorse Critiche",
        severity: "Media-Alta",
        description: "Il passaggio globale ai motori elettrici ed alle fonti rinnovabili ha scatenato una caccia accanita alle materie prime fondamentali (litio, cobalto, nichel, terre rare, rame). La Cina detiene attualmente un monopolio di fatto sulla raffinazione di gran parte di queste risorse strategiche.",
        outlook: "La transizione verde rischia di essere limitata da colli di bottiglia geopolitici, in cui le nazioni produttrici di minerali critici useranno il proprio potere negoziale per imporre condizioni commerciali vantaggiose.",
        affectedAssets: [
          { name: "Commodity (Beni Industriali, Rame)", impact: "Altamente Positivo", effect: "La domanda strutturale di elettrificazione urbana ed industriale supererà costantemente l'offerta estrattiva nel prossimo decennio, sostenendo le quotazioni dei metalli di base." },
          { name: "Petrolio (Brent)", impact: "Volatile", effect: "La sotto-allocazione strutturale di investimenti in esplorazione idrocarburica da parte delle major occidentali, unita alle quote produttive OPEC+, mantiene un pavimento rigido sopra gli 80 dollari al barile." },
          { name: "ETF Azionari Generici (S&P 500)", impact: "Misto", effect: "Pressione sui margini delle case automobilistiche tradizionali costrette a investire massicciamente nella transizione a fronte di alti costi di approvvigionamento delle batterie." }
        ]
      },
      {
        id: "geo-mideast",
        title: "Tensioni nel Medio Oriente e Sicurezza delle Rotte Commerciali",
        severity: "Alta",
        description: "Conflitti e minacce persistenti nei punti critici del transito marittimo globale, in particolare lo stretto di Bab el-Mandeb (Mar Rosso) e lo stretto di Hormuz. I continui attacchi alle navi cargo commerciali impongono la circumnavigazione dell'Africa, allungando i tempi di viaggio e triplicando le tariffe di spedizione.",
        outlook: "Il commercio marittimo subisce ritardi sistemici che influenzano le scorte industriali e l'inflazione al consumo in Europa, mentre i premi assicurativi di trasporto rimangono a livelli eccezionalmente elevati.",
        affectedAssets: [
          { name: "Oro (Spot)", impact: "Fortemente Positivo", effect: "L'oro reagisce immediatamente alle escalation geopolitiche e militari fungendo da 'polizza assicurativa' globale per fondi sovrani e investitori privati." },
          { name: "Petrolio (Brent)", impact: "Fortemente Positivo", effect: "Qualsiasi instabilità o rischio di blocco nello stretto di Hormuz (attraverso cui passa il 20% del petrolio mondiale) inietta un premio di rischio geopolitico immediato sui prezzi del barile." },
          { name: "Azioni di Logistica e Trasporti", impact: "Altamente Positivo per i noli", effect: "Le compagnie di trasporto container beneficiano dell'impennata improvvisa delle tariffe di spedizione spot (noli marittimi) dovuta alla ridotta capacità effettiva della flotta globale." }
        ]
      }
    ]
  }
};
