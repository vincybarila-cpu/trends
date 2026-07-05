/**
 * TRENDS - Core Application Logic (REFRACTORED & POWERED)
 * Gestisce la navigazione, il popolamento dei dati, i modali esplicativi dinamici,
 * l'interruttore del doppio tema (chiaro/scuro), il configuratore di portafoglio custom,
 * il calcolo ponderato dei rendimenti e l'assistente finanziario AI Advisor integrato.
 */

import { TRENDS_DATA } from './data.js';

// ==========================================================================
// DATA DI SPIEGAZIONE DEI MODALI INFORMATIVI
// ==========================================================================
const EXPLANATIONS = {
  "dashboard-general": {
    title: "Panoramica di Mercato",
    content: `
      <p>Questa dashboard offre un <strong>quadro sinottico in tempo reale</strong> dello stato di salute dei mercati finanziari globali.</p>
      <p>Qui puoi monitorare a colpo d'occhio:</p>
      <ul>
        <li><strong>Indici di riferimento</strong>: i principali panieri azionari mondiali (USA, Europa, Giappone).</li>
        <li><strong>Vetrina Asset Class</strong>: una selezione bilanciata di strumenti solidi che compongono un ecosistema d'investimento bilanciato.</li>
        <li><strong>Quadro Geopolitico ed Economico</strong>: eventi ad alto impatto imminenti e allarmi attivi che stanno guidando la volatilità.</li>
      </ul>
      <p>Il sentiment complessivo ti indica se prevale l'ottimismo o la paura nel mercato nel breve periodo.</p>
    `
  },
  "featured-instruments": {
    title: "Strumenti Più Rilevanti",
    content: `
      <p>Gli strumenti mostrati in questa lista rappresentano i <strong>pilastri fondamentali</strong> delle rispettive categorie d'investimento:</p>
      <ul>
        <li><strong>Azioni (Blue-Chip)</strong>: Aziende leader globali con enormi barriere competitive e solidi flussi di cassa (es. Microsoft).</li>
        <li><strong>ETF Indice</strong>: Strumenti a bassissimo costo ideali per catturare la crescita economica di interi mercati diversificati (es. S&P 500 ETF).</li>
        <li><strong>Beni Rifugio (Oro)</strong>: Copertura tradizionale contro la svalutazione valutaria e i rischi geopolitici sistemici.</li>
        <li><strong>Riserva Digitale (Bitcoin)</strong>: Nuova asset class digitale a scarsità limitata e decentralizzata.</li>
      </ul>
      <p><em>Fai clic su qualsiasi riga per approfondire le analisi nella scheda "Strumenti Solidi" nella barra laterale.</em></p>
    `
  },
  "macro-events": {
    title: "Calendario Macroeconomico",
    content: `
      <p>Il calendario macroeconomico segnala le date di pubblicazione dei <strong>fondamentali economici</strong> che influenzano direttamente i tassi d'interesse ed il valore delle valute sovrane.</p>
      <p>Gli eventi sono classificati per:</p>
      <ul>
        <li><strong>Impatto (Alto/Massimo)</strong>: Eventi in grado di scatenare forti oscillazioni immediate (es. decisioni sui tassi di BCE o Fed o dati sull'inflazione e occupazione).</li>
        <li><strong>Attesa</strong>: Il valore economico stimato dagli analisti finanziari. Scostamenti significativi tra il dato reale e quello atteso muovono pesantemente i mercati.</li>
      </ul>
    `
  },
  "geopolitical-alarms": {
    title: "Allarmi Geopolitici Rilevanti",
    content: `
      <p>La geopolitica incide sui mercati finanziari attraverso <strong>canali di trasmissione fisici, logistici, energetici e commerciali</strong>.</p>
      <p>Gli allarmi visualizzati qui riassumono le tensioni globali che stanno attivamente compromettendo rotte logistiche, catene industriali o risorse strategiche, indicando quali asset ne risentono positivamente (es. Oro in caso di guerre) o negativamente.</p>
      <p><em>Puoi approfondire ciascuno scenario geopolitico cliccando sulla card per aprire la sezione dedicata.</em></p>
    `
  },
  "central-banks": {
    title: "Tassi delle Banche Centrali",
    content: `
      <p>I tassi d'interesse decisi dalle Banche Centrali rappresentano il <strong>costo del denaro</strong>.</p>
      <ul>
        <li><strong>Tassi Elevati (Politica Restrittiva)</strong>: Servono a raffreddare un'inflazione galoppante ma aumentano i costi di prestito per aziende e cittadini, rallentando la crescita economica.</li>
        <li><strong>Tassi Bassi (Politica Espansiva)</strong>: Stimolano il credito, gli investimenti e i consumi, ma rischiano di alimentare l'inflazione e indebolire la valuta.</li>
      </ul>
    `
  },
  "instruments-general": {
    title: "Analisi Strumenti Solidi",
    content: `
      <p>Questa sezione consente di esplorare le caratteristiche costruttive e fondamentali di ciascun asset selezionato.</p>
      <p>Puoi ricercare o filtrare gli strumenti per <strong>classe di asset</strong> e <strong>livello di rischio</strong> per comprendere:</p>
      <ul>
        <li><strong>Solidità</strong>: I motivi strategici per cui lo strumento è considerato un pilastro solido nel lungo termine.</li>
        <li><strong>Rischi</strong>: Le minacce oggettive alle performance dello strumento.</li>
        <li><strong>Rendimento Storico</strong>: Grafico interattivo del rendimento annuale degli ultimi 5 anni.</li>
      </ul>
    `
  },
  "macro-general": {
    title: "Indicatori Macroeconomici",
    content: `
      <p>Il quadro macroeconomico definisce lo <strong>sfondo globale</strong> in cui operano le aziende.</p>
      <p>I tre pilastri fondamentali monitorati sono:</p>
      <ul>
        <li><strong>Inflazione (CPI)</strong>: Tasso di aumento del costo della vita. Se eccessivo, erode il capitale ed innesca aumenti dei tassi.</li>
        <li><strong>Prodotto Interno Lordo (PIL)</strong>: Misura la crescita economica complessiva di una nazione.</li>
        <li><strong>Disoccupazione</strong>: Indica lo stato del mercato del lavoro, termometro cruciale per le banche centrali (es. mandato della Fed per la stabilità ed occupazione).</li>
      </ul>
    `
  },
  "banks-rates-chart": {
    title: "Andamento Storico dei Tassi",
    content: `
      <p>Questo grafico visualizza il <strong>percorso storico dei tassi d'interesse</strong> delle principali banche centrali mondiali (Fed, BCE, PBOC).</p>
      <p>Esso evidenzia la divergenza attuale tra:</p>
      <ul>
        <li><strong>Occidente (USA ed Europa)</strong>: Che mantengono tassi restrittivi per stabilizzare l'inflazione post-pandemica.</li>
        <li><strong>Oriente (Cina)</strong>: Che attua politiche di stimolo tagliando i tassi per favorire il rilancio immobiliare e creditizio.</li>
      </ul>
    `
  },
  "banks-policies-detail": {
    title: "Dettaglio Politiche Monetarie",
    content: `
      <p>Fornisce un'analisi qualitativa sul <strong>funzionamento e l'orientamento attuale (stance)</strong> dei singoli comitati monetari sovrani.</p>
      <p>Spiega il 'perché' dietro la determinazione dei tassi e quale scenario futuro (tagli, rialzi o stazionarietà) viene anticipato al mercato tramite le loro dichiarazioni pubbliche (Forward Guidance).</p>
    `
  },
  "geopolitics-general": {
    title: "Scenari Geopolitici",
    content: `
      <p>Collega gli eventi di politica estera, conflitti ed alleanze commerciali al <strong>portafoglio d'investimento</strong>.</p>
      <p>Utilizza questa sezione per visualizzare:</p>
      <ul>
        <li><strong>Analisi strategica</strong> dello scenario e il relativo orizzonte di lungo termine.</li>
        <li><strong>Matrice degli Impatti</strong>: Una tabella che mappa l'effetto specifico di quello scenario (es. positivo, negativo o volatile) sui singoli mercati finanziari.</li>
      </ul>
    `
  },
  "simulator-general": {
    title: "Simulatore di Portafoglio ed Interesse Composto",
    content: `
      <p>Il simulatore consente di testare il comportamento di un portafoglio finanziario personalizzato combinando la **gamma di 17 strumenti solidi** della piattaforma.</p>
      <p>La simulazione impiega il principio dell'**interesse composto** (capitalizzazione mensile degli interessi) e si basa sulle percentuali di allocazione decise da te o suggerite dall'AI Advisor.</p>
      <p><em>Invece di un grafico generico, ti viene restituito un piano di ammortamento anno per anno con il calcolo degli interessi cumulati.</em></p>
    `
  },
  "simulator-inputs": {
    title: "Configurazione Parametri Proiezione",
    content: `
      <p>Configura i parametri fondamentali del piano d'investimento:</p>
      <ul>
        <li><strong>Capitale Iniziale</strong>: La somma che decidi di allocare al tempo zero.</li>
        <li><strong>PAC Mensile</strong>: Contributo periodico costante, essenziale per mediare i prezzi di acquisto nel tempo.</li>
        <li><strong>Orizzonte Temporale</strong>: Gli anni di durata dell'investimento.</li>
        <li><strong>Composizione Portafoglio</strong>: Spunta gli strumenti desiderati ed inserisci la percentuale di allocazione. La somma di tutti i pesi inseriti deve essere **esattamente pari al 100%** per validare il calcolo.</li>
      </ul>
    `
  },
  "simulator-results": {
    title: "Risultati & Piano di Ammortamento",
    content: `
      <p>Questo pannello sintetizza la <strong>crescita stimata del portafoglio</strong> attraverso dati numerici chiari ed un piano di ammortamento anno per anno.</p>
      <ul>
        <li><strong>Rendimento Stimato</strong>: La media ponderata dei rendimenti storici degli asset da te selezionati nel portafoglio.</li>
        <li><strong>Profilo Rischio</strong>: Il livello di rischio complessivo ponderato del portafoglio (da Minimo a Molto Alto).</li>
        <li><strong>Tabella di Ammortamento</strong>: Mostra anno per anno i tuoi risparmi cumulati totali rispetto agli interessi capitalizzati generati dal reinvestimento automatico.</li>
      </ul>
    `
  },
  "ai-advisor-general": {
    title: "AI Investment Advisor",
    content: `
      <p>L'<strong>AI Investment Advisor</strong> è un analista algoritmico integrato che elabora allocazioni di portafoglio su misura.</p>
      <p>Puoi sfruttarlo in due modi:</p>
      <ul>
        <li><strong>Preset Rapidi</strong>: Clicca su uno dei badge per applicare configurazioni standard (Cauto, Bilanciato, Aggressivo).</li>
        <li><strong>Prompt di Testo</strong>: Descrivi la tua situazione e le tue richieste (es. <em>"Voglio un portafoglio a rischio minimo incentrato su obbligazioni europee e oro"</em>). L'AI analizzerà le parole chiave, scriverà le sue valutazioni in chat ed **autocompilerà le percentuali e i parametri del modulo simulazione all'istante**.</li>
      </ul>
    `
  }
};

// Stato globale dell'applicazione
const state = {
  activeSection: 'dashboard',
  selectedInstrumentId: null,
  selectedScenarioId: null,
  charts: {
    instrument: null,
    macro: null
  }
};

// Portafogli di riferimento per l'AI Advisor
const AI_PORTFOLIOS = {
  cauto: [
    { id: "aggh", weight: 40 },
    { id: "us2y", weight: 20 },
    { id: "btp10y", weight: 15 },
    { id: "gold", weight: 15 },
    { id: "ko", weight: 10 }
  ],
  bilanciato: [
    { id: "vwce", weight: 35 },
    { id: "spy", weight: 20 },
    { id: "gld", weight: 15 },
    { id: "us10y", weight: 15 },
    { id: "aapl", weight: 10 },
    { id: "btc", weight: 5 }
  ],
  aggressivo: [
    { id: "qqq", weight: 30 },
    { id: "nvda", weight: 25 },
    { id: "btc", weight: 20 },
    { id: "aapl", weight: 15 },
    { id: "asml", weight: 10 }
  ]
};

// ==========================================================================
// INIZIALIZZAZIONE APPLICAZIONE
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initClock();
  initTheme();
  initModals();
  renderMarketTicker();

  // Renderizzazione moduli iniziali
  renderDashboard();
  renderInstrumentsList();
  renderMacroHub();
  renderGeopoliticsHub();
  initSimulator();

  // Aggiornamento asincrono con i dati live più recenti (market-data.json)
  loadLiveData();
});

// ==========================================================================
// DATI LIVE (market-data.json aggiornato ogni ora da GitHub Actions)
// ==========================================================================
async function loadLiveData() {
  const freshnessEl = document.getElementById('data-freshness');
  try {
    const resp = await fetch('./market-data.json?t=' + Date.now(), { cache: 'no-store' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const live = await resp.json();

    // Merge indici (per simbolo)
    if (Array.isArray(live.indices)) {
      live.indices.forEach(li => {
        const idx = TRENDS_DATA.indices.find(i => i.symbol === li.symbol);
        if (idx) Object.assign(idx, li);
      });
    }

    // Merge Bitcoin
    if (live.btc) {
      const btc = TRENDS_DATA.instruments.find(i => i.id === 'btc');
      if (btc) {
        btc.currentPrice = live.btc.currentPrice;
        btc.changePercent = live.btc.changePercent;
        btc.status = live.btc.status;
      }
    }

    // Re-render delle viste che mostrano questi dati
    renderMarketTicker();
    renderDashboard();
    renderInstrumentsList();
    if (state.selectedInstrumentId) renderInstrumentDetail(state.selectedInstrumentId);

    if (freshnessEl && live.lastUpdate) {
      const d = new Date(live.lastUpdate);
      const when = d.toLocaleString('it-IT', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
      });
      freshnessEl.innerHTML = `<i class="fa-solid fa-tower-broadcast"></i> Dati aggiornati: ${when}`;
      freshnessEl.classList.remove('stale');
      freshnessEl.classList.add('fresh');
    }
  } catch (err) {
    // Offline o file non raggiungibile: l'app resta utilizzabile con i dati
    // statici del bundle, ma l'utente viene avvisato che non sono aggiornati
    if (freshnessEl) {
      freshnessEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Dati live non raggiungibili';
      freshnessEl.classList.remove('fresh');
      freshnessEl.classList.add('stale');
    }
  }
}

// ==========================================================================
// GESTIONE DEL TEMA (CHIARO/SCURO)
// ==========================================================================
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  
  // Controlla preferenza salvata in localStorage
  const savedTheme = localStorage.getItem('trends-theme');
  const isLight = savedTheme === 'light';
  
  if (isLight) {
    document.body.classList.add('light-theme');
    updateThemeButton(true);
  } else {
    document.body.classList.remove('light-theme');
    updateThemeButton(false);
  }
  
  themeToggle.addEventListener('click', () => {
    const nowLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('trends-theme', nowLight ? 'light' : 'dark');
    updateThemeButton(nowLight);
    
    // Rinfresca i grafici attivi per caricare i nuovi colori delle griglie
    refreshActiveCharts();
  });
}

function updateThemeButton(isLight) {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    if (isLight) {
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i> <span>Tema Scuro</span>';
    } else {
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> <span>Tema Chiaro</span>';
    }
  }
}

function refreshActiveCharts() {
  // Grafico Macro
  if (state.activeSection === 'macro') {
    renderMacroChart();
  }
  // Grafico Strumento Dettaglio
  if (state.selectedInstrumentId) {
    const ins = TRENDS_DATA.instruments.find(item => item.id === state.selectedInstrumentId);
    if (ins) renderInstrumentChart(ins);
  }
}

// ==========================================================================
// GESTIONE DEL MODALE INFORMATIVO DINAMICO
// ==========================================================================
function initModals() {
  const modalOverlay = document.getElementById('info-modal');
  const modalClose = document.getElementById('modal-close');
  
  function openInfoModal(key) {
    const info = EXPLANATIONS[key];
    if (info) {
      document.getElementById('modal-title').textContent = info.title;
      document.getElementById('modal-body').innerHTML = info.content;
      modalOverlay.classList.add('active');
    }
  }
  
  function closeInfoModal() {
    modalOverlay.classList.remove('active');
  }
  
  // Delegazione degli eventi per intercettare i click sui pulsanti info
  document.addEventListener('click', (e) => {
    const infoBtn = e.target.closest('.info-btn, .info-btn-title');
    if (infoBtn) {
      e.preventDefault();
      e.stopPropagation();
      const infoKey = infoBtn.getAttribute('data-info');
      openInfoModal(infoKey);
    }
  });
  
  modalClose.addEventListener('click', closeInfoModal);
  
  // Chiude cliccando sull'overlay di sfondo
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeInfoModal();
    }
  });
  
  // Chiude premendo il tasto Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeInfoModal();
    }
  });
}

// ==========================================================================
// FUNZIONE CLOCK & DATA DI SISTEMA
// ==========================================================================
function initClock() {
  const timeElement = document.getElementById('current-time');
  const dateElement = document.getElementById('current-date');
  
  // Aggiorna data iniziale
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = now.toLocaleDateString('it-IT', options);
  
  // Ticker orologio ogni secondo
  setInterval(() => {
    const timeNow = new Date();
    timeElement.textContent = timeNow.toLocaleTimeString('it-IT');
  }, 1000);
}

// ==========================================================================
// GESTIONE NAVIGAZIONE TRA SEZIONI (SPA)
// ==========================================================================
function initNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  const sections = document.querySelectorAll('.section-pane');

  function navigateTo(hash) {
    const targetId = hash.replace('#', '') || 'dashboard';
    
    // Rimuove la classe attiva da tutti i menu e sezioni
    menuItems.forEach(item => item.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active'));
    
    // Trova il menu corretto da evidenziare
    const activeMenu = document.getElementById(`nav-${targetId}`);
    if (activeMenu) {
      activeMenu.classList.add('active');
    }
    
    // Mostra la sezione corretta
    const activeSection = document.getElementById(targetId);
    if (activeSection) {
      activeSection.classList.add('active');
    }

    state.activeSection = targetId;

    // Trigger per il rendering dei grafici specifici all'apertura delle sezioni
    if (targetId === 'macro') {
      setTimeout(renderMacroChart, 100);
    }
  }

  // Listener sui click dei link di navigazione
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const hash = item.getAttribute('href');
      navigateTo(hash);
    });
  });

  // Gestione del caricamento iniziale e dell'indietro nel browser
  window.addEventListener('hashchange', () => {
    navigateTo(window.location.hash);
  });
  
  // Esegue al primo avvio
  if (window.location.hash) {
    navigateTo(window.location.hash);
  }
}

// ==========================================================================
// POPOLAMENTO TICKER MERCATI
// ==========================================================================
function renderMarketTicker() {
  const wrapper = document.getElementById('ticker-wrapper');
  wrapper.innerHTML = '';
  
  // Raddoppiamo gli elementi per garantire un effetto di scorrimento continuo infinito
  const doubledIndices = [...TRENDS_DATA.indices, ...TRENDS_DATA.indices];
  
  doubledIndices.forEach(idx => {
    const isUp = idx.change.startsWith('+');
    const changeClass = isUp ? 'up' : 'down';
    const caretIcon = isUp ? '<i class="fa-solid fa-caret-up"></i>' : '<i class="fa-solid fa-caret-down"></i>';
    
    const tickerItem = document.createElement('div');
    tickerItem.className = 'ticker-item';
    const tickerEstimated = idx.estimated ? '<span class="estimated-badge">stimato</span>' : '';
    tickerItem.innerHTML = `
      <span class="ticker-symbol">${idx.symbol}${tickerEstimated}</span>
      <span class="ticker-name">${idx.name}</span>
      <span class="ticker-value">${idx.value}</span>
      <span class="ticker-change ${changeClass}">${caretIcon} ${idx.change}</span>
    `;
    wrapper.appendChild(tickerItem);
  });
}

// ==========================================================================
// SEZIONE 1: DASHBOARD
// ==========================================================================
function renderDashboard() {
  // 1. Popolamento griglia indici superiori
  const indicesGrid = document.getElementById('indices-grid');
  indicesGrid.innerHTML = '';
  
  TRENDS_DATA.indices.forEach(idx => {
    const isPositive = idx.status === 'positive';
    const signClass = isPositive ? 'positive' : 'negative';
    const icon = isPositive ? '<i class="fa-solid fa-arrow-trend-up"></i>' : '<i class="fa-solid fa-arrow-trend-down"></i>';
    
    const estimatedBadge = idx.estimated
      ? '<span class="estimated-badge" title="Dato simulato: fonte reale non disponibile al momento dell\'aggiornamento">stimato</span>'
      : '';

    const card = document.createElement('div');
    card.className = 'index-card';
    card.innerHTML = `
      <div class="index-symbol">${idx.symbol} ${estimatedBadge}</div>
      <div class="index-name">${idx.name}</div>
      <div class="index-values">
        <span class="index-price">${idx.value}</span>
        <span class="index-change ${signClass}">${icon} ${idx.change}</span>
      </div>
    `;
    indicesGrid.appendChild(card);
  });
  
  // 2. Strumenti Rilevanti (Vetrina di 4 strumenti chiave)
  const featuredContainer = document.getElementById('featured-instruments');
  featuredContainer.innerHTML = '';
  
  // Selezioniamo 4 strumenti variegati
  const featuredIds = ['msft', 'spy', 'gld', 'btc'];
  const featured = TRENDS_DATA.instruments.filter(ins => featuredIds.includes(ins.id));
  
  featured.forEach(ins => {
    const item = document.createElement('div');
    item.className = 'featured-item';
    item.innerHTML = `
      <div class="featured-info">
        <div class="featured-badge">${ins.symbol}</div>
        <div class="featured-details">
          <h4>${ins.name}</h4>
          <p>${ins.subcategory}</p>
        </div>
      </div>
      <div class="featured-yields">
        <div class="featured-price">${ins.currentPrice}</div>
        <span class="featured-cat-tag tag-${ins.category.toLowerCase()}">${ins.category}</span>
      </div>
    `;
    
    // Rende l'elemento cliccabile portando al dettaglio dello strumento
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      state.selectedInstrumentId = ins.id;
      window.location.hash = '#strumenti';
      renderInstrumentsList();
      renderInstrumentDetail(ins.id);
    });
    
    featuredContainer.appendChild(item);
  });
  
  // 3. Eventi Macroeconomici Chiave
  const eventsContainer = document.getElementById('economic-events');
  eventsContainer.innerHTML = '';
  
  TRENDS_DATA.macro.calendar.forEach(ev => {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event-item';
    eventDiv.innerHTML = `
      <div class="event-date">${ev.date.split(' ')[0]} ${ev.date.split(' ')[1].slice(0,3)}</div>
      <div class="event-desc">
        <h4>${ev.event}</h4>
        <div class="event-meta">
          <span>Impatto: <strong class="impact-badge impact-${ev.impact.toLowerCase()}">${ev.impact}</strong></span>
          <span>Atteso: <strong>${ev.expectation}</strong></span>
        </div>
      </div>
    `;
    eventsContainer.appendChild(eventDiv);
  });
  
  // 4. Allarmi Geopolitici
  const alarmsContainer = document.getElementById('geopolitical-alarms');
  alarmsContainer.innerHTML = '';
  
  TRENDS_DATA.geopolitics.scenarios.slice(0, 2).forEach(scen => {
    const alarmDiv = document.createElement('div');
    alarmDiv.className = 'alarm-item';
    alarmDiv.innerHTML = `
      <i class="fa-solid fa-triangle-exclamation"></i>
      <div class="alarm-info">
        <h4>${scen.title}</h4>
        <p>${scen.description.slice(0, 150)}...</p>
        <div class="alarm-impacts-row">
          ${scen.affectedAssets.slice(0, 2).map(ass => `
            <span class="impact-asset-tag"><strong>${ass.name}</strong>: ${ass.impact}</span>
          `).join('')}
        </div>
      </div>
    `;
    
    alarmDiv.style.cursor = 'pointer';
    alarmDiv.addEventListener('click', () => {
      state.selectedScenarioId = scen.id;
      window.location.hash = '#geopolitica';
      renderGeopoliticsHub();
    });
    
    alarmsContainer.appendChild(alarmDiv);
  });
  
  // 5. Sintesi Tassi Banche Centrali
  const banksContainer = document.getElementById('central-banks-list');
  banksContainer.innerHTML = '';
  
  TRENDS_DATA.macro.centralBanks.forEach(bank => {
    const bankDiv = document.createElement('div');
    bankDiv.className = 'bank-item';
    bankDiv.innerHTML = `
      <span class="bank-name">${bank.name}</span>
      <span class="bank-rate-badge">${bank.rate}</span>
    `;
    banksContainer.appendChild(bankDiv);
  });
}

// ==========================================================================
// SEZIONE 2: STRUMENTI FINANZIARI SOLIDI
// ==========================================================================
function renderInstrumentsList() {
  const listContainer = document.getElementById('instruments-list');
  listContainer.innerHTML = '';
  
  const searchVal = document.getElementById('instrument-search').value.toLowerCase();
  const categoryFilter = document.getElementById('filter-category').value;
  const riskFilter = document.getElementById('filter-risk').value;
  
  // Filtraggio
  const filtered = TRENDS_DATA.instruments.filter(ins => {
    const matchesSearch = ins.name.toLowerCase().includes(searchVal) || ins.symbol.toLowerCase().includes(searchVal);
    const matchesCategory = categoryFilter === 'all' || ins.category === categoryFilter;
    
    let matchesRisk = true;
    if (riskFilter !== 'all') {
      if (riskFilter === 'Basso') {
        matchesRisk = ins.risk.includes('Basso') || ins.risk.includes('Minimo');
      } else if (riskFilter === 'Medio') {
        matchesRisk = ins.risk.includes('Medio');
      } else if (riskFilter === 'Alto') {
        matchesRisk = ins.risk.includes('Alto') || ins.risk.includes('Molto Alto');
      }
    }
    
    return matchesSearch && matchesCategory && matchesRisk;
  });
  
  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div style="padding: 30px; text-align: center; color: var(--text-muted);">
        <i class="fa-solid fa-circle-info" style="font-size: 1.5rem; margin-bottom: 10px; display: block;"></i>
        Nessuno strumento soddisfa i filtri selezionati.
      </div>
    `;
    return;
  }
  
  filtered.forEach(ins => {
    const isSelected = state.selectedInstrumentId === ins.id;
    const item = document.createElement('div');
    item.className = `instrument-list-item ${isSelected ? 'selected' : ''}`;
    
    let riskClass = 'risk-medio';
    if (ins.risk.includes('Basso') || ins.risk.includes('Minimo')) riskClass = 'risk-basso';
    if (ins.risk.includes('Alto')) riskClass = 'risk-alto';
    
    item.innerHTML = `
      <div class="ins-list-info">
        <h4>${ins.symbol}</h4>
        <span>${ins.name}</span>
      </div>
      <div class="ins-list-data">
        <div class="ins-list-price">${ins.currentPrice}</div>
        <div class="risk-dot-badge">
          <span class="risk-dot ${riskClass}"></span> ${ins.risk}
        </div>
      </div>
    `;
    
    item.addEventListener('click', () => {
      state.selectedInstrumentId = ins.id;
      // Aggiorna classi di selezione nella lista
      document.querySelectorAll('.instrument-list-item').forEach(el => el.classList.remove('selected'));
      item.classList.add('selected');
      
      renderInstrumentDetail(ins.id);
    });
    
    listContainer.appendChild(item);
  });
}

function renderInstrumentDetail(id) {
  const detailContainer = document.getElementById('instrument-detail');
  const ins = TRENDS_DATA.instruments.find(item => item.id === id);
  
  if (!ins) {
    detailContainer.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-hand-pointer animate-pulse"></i>
        <h4>Seleziona uno strumento</h4>
        <p>Clicca su uno strumento nella lista a sinistra per visualizzarne i dettagli analitici, il rendimento storico e i motivi di solidità.</p>
      </div>
    `;
    return;
  }
  
  const isUp = ins.changePercent.startsWith('+');
  const statusClass = isUp ? 'text-green' : 'text-red';
  const caretIcon = isUp ? '<i class="fa-solid fa-caret-up"></i>' : '<i class="fa-solid fa-caret-down"></i>';
  
  detailContainer.innerHTML = `
    <div class="detail-header">
      <div class="detail-title">
        <h2>${ins.name} (${ins.symbol})</h2>
        <div class="detail-subtitle">
          <span class="featured-cat-tag tag-${ins.category.toLowerCase()}">${ins.category}</span>
          <span>•</span>
          <span>${ins.subcategory}</span>
          <span>•</span>
          <span>Rischio: <strong>${ins.risk}</strong> (Score: ${ins.riskScore}/5)</span>
        </div>
      </div>
      <div class="detail-pricing">
        <div class="detail-price">${ins.currentPrice}</div>
        <div class="detail-change ${statusClass}">${caretIcon} ${ins.changePercent}</div>
      </div>
    </div>
    
    <div class="detail-grid">
      <div class="detail-block">
        <h4><i class="fa-solid fa-circle-info text-blue"></i> Descrizione dello Strumento</h4>
        <p>${ins.description}</p>
      </div>
      
      <div class="detail-block">
        <h4><i class="fa-solid fa-shield-check text-green"></i> Perché è Solido e Rilevante</h4>
        <div class="rationale-box">
          <p>${ins.solidRationale}</p>
        </div>
      </div>
      
      <div class="detail-block" style="grid-column: span 2;">
        <h4><i class="fa-solid fa-triangle-exclamation text-red"></i> Principali Fattori di Rischio</h4>
        <div class="risks-box">
          <p>${ins.risks}</p>
        </div>
      </div>
    </div>
    
    <div class="detail-chart-wrapper">
      <h4><i class="fa-solid fa-chart-line text-gold"></i> Performance Storica Consolidata (% Rendimento Annuo)</h4>
      <div class="detail-chart-container">
        <canvas id="instrumentHistoryChart"></canvas>
      </div>
    </div>
  `;
  
  // Rendering del grafico storico con Chart.js
  setTimeout(() => {
    renderInstrumentChart(ins);
  }, 50);
}

function renderInstrumentChart(instrument) {
  // Distrugge il grafico precedente se presente
  if (state.charts.instrument) {
    state.charts.instrument.destroy();
  }
  
  const ctx = document.getElementById('instrumentHistoryChart').getContext('2d');
  const labels = instrument.historicalYields.map(y => y.year);
  const data = instrument.historicalYields.map(y => y.yield);
  
  // Rileva colore tema in tempo reale per le griglie
  const isLight = document.body.classList.contains('light-theme');
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)';
  const labelColor = isLight ? '#4a5568' : '#a0aec0';
  
  state.charts.instrument = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Rendimento Annuo %',
        data: data,
        backgroundColor: data.map(val => val >= 0 ? 'rgba(34, 197, 94, 0.45)' : 'rgba(239, 68, 68, 0.45)'),
        borderColor: data.map(val => val >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'),
        borderWidth: 1.5,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Rendimento: ${context.parsed.y}%`;
            }
          }
        }
      },
      scales: {
        y: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: labelColor,
            callback: function(value) {
              return value + '%';
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: labelColor
          }
        }
      }
    }
  });
}

// ==========================================================================
// SEZIONE 3: QUADRO MACROECONOMICO
// ==========================================================================
function renderMacroHub() {
  // 1. Popolamento indicatori macroeconomici principali
  const indicatorsGrid = document.getElementById('macro-indicators');
  indicatorsGrid.innerHTML = '';
  
  TRENDS_DATA.macro.indicators.forEach(ind => {
    const isUS = ind.name.includes('USA');
    const flag = isUS ? '🇺🇸' : '🇪🇺';
    
    const card = document.createElement('div');
    card.className = 'macro-indicator-card';
    card.innerHTML = `
      <div class="macro-indicator-name">${flag} ${ind.name}</div>
      <div class="macro-indicator-value">${ind.actual}</div>
      <div class="macro-indicator-footer">
        <span>Precedente: ${ind.previous}</span>
        <span class="text-gold">${ind.status}</span>
      </div>
    `;
    indicatorsGrid.appendChild(card);
  });
  
  // 2. Dettaglio politiche monetarie delle banche centrali
  const banksDetailed = document.getElementById('central-banks-detailed');
  banksDetailed.innerHTML = '';
  
  TRENDS_DATA.macro.centralBanks.forEach(bank => {
    const item = document.createElement('div');
    item.className = 'bank-detail-item';
    item.innerHTML = `
      <div class="bank-detail-header">
        <div class="bank-detail-title">
          <h4>${bank.name}</h4>
          <span>Regione: ${bank.region}</span>
        </div>
        <div class="bank-detail-rate">Tasso: ${bank.rate}</div>
      </div>
      <div class="bank-detail-meta">
        <div>Inflazione Corrente: <strong>${bank.inflation}</strong></div>
        <div>Target Inflazione: <strong>${bank.inflationTarget}</strong></div>
        <div>Orientamento (Stance): <strong class="text-gold">${bank.stance}</strong></div>
      </div>
      <div class="bank-detail-comment">
        ${bank.comment}
      </div>
    `;
    banksDetailed.appendChild(item);
  });
}

function renderMacroChart() {
  if (state.charts.macro) {
    state.charts.macro.destroy();
  }
  
  const ctx = document.getElementById('macroTassiChart').getContext('2d');
  
  const isLight = document.body.classList.contains('light-theme');
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)';
  const labelColor = isLight ? '#4a5568' : '#a0aec0';
  
  state.charts.macro = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Oggi (2026)'],
      datasets: [
        {
          label: 'Federal Reserve (USA)',
          data: [5.50, 5.50, 5.50, 5.25, 5.25, 5.50, 5.50],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1,
          borderWidth: 2,
          fill: false
        },
        {
          label: 'BCE (Eurozona)',
          data: [4.50, 4.50, 4.25, 4.00, 4.00, 4.25, 4.50],
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.1,
          borderWidth: 2,
          fill: false
        },
        {
          label: 'PBOC (Cina)',
          data: [3.45, 3.45, 3.35, 3.35, 3.35, 3.45, 3.45],
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          tension: 0.1,
          borderWidth: 2,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: labelColor,
            font: {
              family: 'Outfit'
            }
          }
        }
      },
      scales: {
        y: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: labelColor,
            callback: function(value) {
              return value.toFixed(2) + '%';
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: labelColor
          }
        }
      }
    }
  });
}

// ==========================================================================
// SEZIONE 4: ANALISI GEOPOLITICA
// ==========================================================================
function renderGeopoliticsHub() {
  const selector = document.getElementById('scenarios-selector');
  selector.innerHTML = '';
  
  TRENDS_DATA.geopolitics.scenarios.forEach(scen => {
    const isSelected = state.selectedScenarioId === scen.id || (!state.selectedScenarioId && scen.id === 'geo-tech');
    
    // Se non c'è scenario selezionato nello stato, impostiamo il primo come default
    if (isSelected && !state.selectedScenarioId) {
      state.selectedScenarioId = scen.id;
    }
    
    const card = document.createElement('div');
    card.className = `scenario-select-card ${isSelected ? 'selected' : ''}`;
    
    let severityClass = 'severity-media-alta';
    if (scen.severity === 'Alta') severityClass = 'severity-alta';
    
    card.innerHTML = `
      <h4>${scen.title}</h4>
      <div class="scenario-meta">
        <span class="severity-label ${severityClass}">Gravità: ${scen.severity}</span>
        <span style="color: var(--text-muted); font-size: 0.8rem;">Vedi impatto <i class="fa-solid fa-chevron-right"></i></span>
      </div>
    `;
    
    card.addEventListener('click', () => {
      state.selectedScenarioId = scen.id;
      document.querySelectorAll('.scenario-select-card').forEach(el => el.classList.remove('selected'));
      card.classList.add('selected');
      renderScenarioDetail(scen.id);
    });
    
    selector.appendChild(card);
  });
  
  // Renderizza il dettaglio dello scenario attivo
  if (state.selectedScenarioId) {
    renderScenarioDetail(state.selectedScenarioId);
  }
}

function renderScenarioDetail(id) {
  const detailContainer = document.getElementById('scenario-detail');
  const scen = TRENDS_DATA.geopolitics.scenarios.find(item => item.id === id);
  
  if (!scen) {
    detailContainer.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-earth-americas animate-spin-slow"></i>
        <h4>Seleziona uno Scenario Geopolitico</h4>
        <p>Fai clic su uno degli scenari attivi a sinistra per esplorare le implicazioni macro, i canali di trasmissione e la matrice degli impatti sugli asset class.</p>
      </div>
    `;
    return;
  }
  
  const bannerClass = scen.id === 'geo-tech' ? 'banner-tech' : scen.id === 'geo-energy' ? 'banner-energy' : 'banner-mideast';
  const bannerIcon  = scen.id === 'geo-tech' ? 'fa-microchip' : scen.id === 'geo-energy' ? 'fa-bolt' : 'fa-globe-asia';

  detailContainer.innerHTML = `
    <div class="scenario-cover-banner ${bannerClass}">
      <div class="scenario-banner-inner">
        <i class="fa-solid ${bannerIcon} banner-icon"></i>
        <span class="banner-label">${scen.severity === 'Alta' ? '⚠ RISCHIO ALTO' : '⚠ RISCHIO MEDIO-ALTO'}</span>
      </div>
    </div>
    <div class="scenario-det-header">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span class="severity-label ${scen.severity === 'Alta' ? 'severity-alta' : 'severity-media-alta'}">Rischio di Impatto: ${scen.severity}</span>
      </div>
      <h2>${scen.title}</h2>
    </div>
    
    <div class="scenario-det-desc">
      ${scen.description}
    </div>
    
    <div class="scenario-det-outlook">
      <h3>Prospettive Macroeconomiche</h3>
      <p>${scen.outlook}</p>
    </div>
    
    <div class="scenario-impacts-section">
      <h3>Matrice d'Impatto sugli Asset Rilevanti</h3>
      <div class="impact-matrix">
        ${scen.affectedAssets.map(ass => {
          let impactClass = 'impact-volatile';
          if (ass.impact.includes('Positivo')) impactClass = 'impact-positivo';
          if (ass.impact.includes('Negativo')) impactClass = 'impact-negativo';
          if (ass.impact.includes('Misto') || ass.impact.includes('Volatile')) impactClass = 'impact-misto';
          
          return `
            <div class="matrix-row">
              <div class="matrix-asset-name">${ass.name}</div>
              <div class="matrix-asset-impact ${impactClass}">${ass.impact}</div>
              <div class="matrix-asset-effect">${ass.effect}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ==========================================================================
// SEZIONE 5: SIMULATORE DI INTERESSE COMPOSTO / PORTAFOGLIO & AI ADVISOR
// ==========================================================================
function initSimulator() {
  const form = document.getElementById('simulator-form');
  const yearsSlider = document.getElementById('sim-years');
  const yearsVal = document.getElementById('sim-years-val');
  const selectionList = document.getElementById('portfolio-selection-list');
  
  // 1. Popola dinamicamente il configuratore di portafoglio a livello di form con i 17 strumenti
  selectionList.innerHTML = '';
  TRENDS_DATA.instruments.forEach(ins => {
    const item = document.createElement('div');
    item.className = 'portfolio-selection-item';
    item.innerHTML = `
      <label class="portfolio-item-left">
        <input type="checkbox" data-id="${ins.id}" class="portfolio-item-check">
        <span class="portfolio-item-symbol">${ins.symbol}</span>
        <span class="portfolio-item-name" title="${ins.name}">${ins.name}</span>
      </label>
      <div class="portfolio-item-right" style="display: none;">
        <input type="number" data-id="${ins.id}" class="portfolio-item-weight" min="1" max="100" value="0">
        <span>%</span>
      </div>
    `;
    selectionList.appendChild(item);
  });

  // Gestione comparsa degli input % in base ai checkbox spuntati
  const checks = selectionList.querySelectorAll('.portfolio-item-check');
  checks.forEach(check => {
    check.addEventListener('change', (e) => {
      const itemRow = e.target.closest('.portfolio-selection-item');
      const itemRight = itemRow.querySelector('.portfolio-item-right');
      const weightInput = itemRight.querySelector('.portfolio-item-weight');
      
      if (e.target.checked) {
        itemRight.style.display = 'flex';
        // Assegna un peso di default di 10% per velocizzare la configurazione se a zero
        if (parseFloat(weightInput.value || 0) === 0) {
          weightInput.value = 10;
        }
      } else {
        itemRight.style.display = 'none';
        weightInput.value = 0;
      }
      updateWeightCounter();
    });
  });

  // Monitora l'input manuale dei pesi
  const weights = selectionList.querySelectorAll('.portfolio-item-weight');
  weights.forEach(input => {
    input.addEventListener('input', updateWeightCounter);
  });

  // Aggiorna l'etichetta degli anni durante lo scorrimento dello slider
  yearsSlider.addEventListener('input', (e) => {
    yearsVal.textContent = `${e.target.value} anni`;
  });

  // Gestore del submit del form principale
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isValid = updateWeightCounter();
    if (!isValid) {
      document.getElementById('portfolio-error-msg').style.display = 'block';
      return;
    }
    
    const capital = parseFloat(document.getElementById('sim-capital').value);
    const pac = parseFloat(document.getElementById('sim-contribution').value);
    const years = parseInt(yearsSlider.value);
    
    // Calcolo del rendimento ponderato e del rischio ponderato
    const checkedChecks = selectionList.querySelectorAll('.portfolio-item-check:checked');
    let weightedYield = 0;
    let weightedRiskScore = 0;
    
    checkedChecks.forEach(check => {
      const id = check.getAttribute('data-id');
      const row = check.closest('.portfolio-selection-item');
      const weightInput = row.querySelector('.portfolio-item-weight');
      const weightFraction = parseFloat(weightInput.value || 0) / 100;
      
      const ins = TRENDS_DATA.instruments.find(item => item.id === id);
      weightedYield += ins.expectedYield * weightFraction;
      weightedRiskScore += ins.riskScore * weightFraction;
    });

    // Aggiornamento statistiche sull'header
    document.getElementById('stat-weighted-yield').textContent = `${weightedYield.toFixed(2)}%`;
    
    let riskLabel = "--";
    if (weightedRiskScore <= 1.5) riskLabel = "Minimo 🛡️";
    else if (weightedRiskScore <= 2.5) riskLabel = "Basso-Medio ⚖️";
    else if (weightedRiskScore <= 3.5) riskLabel = "Medio 📈";
    else if (weightedRiskScore <= 4.5) riskLabel = "Alto ⚡";
    else riskLabel = "Molto Alto 🔥";
    
    document.getElementById('stat-weighted-risk').textContent = riskLabel;
    
    calculateSimulation(capital, pac, years, weightedYield);
  });

  // Inizializza l'AI Advisor
  initAIAdvisor();
}

function updateWeightCounter() {
  const checkedItems = document.querySelectorAll('.portfolio-item-check:checked');
  let sum = 0;
  
  checkedItems.forEach(check => {
    const row = check.closest('.portfolio-selection-item');
    const input = row.querySelector('.portfolio-item-weight');
    sum += parseFloat(input.value || 0);
  });
  
  const counter = document.getElementById('weight-counter');
  const errorMsg = document.getElementById('portfolio-error-msg');
  const currentSumSpan = document.getElementById('current-weight-sum');
  
  counter.textContent = `${sum}%`;
  currentSumSpan.textContent = `${sum}%`;
  
  if (sum === 100) {
    counter.className = 'weight-indicator-good';
    errorMsg.style.display = 'none';
    return true;
  } else {
    counter.className = 'weight-indicator-bad';
    if (sum > 0) {
      errorMsg.style.display = 'block';
    } else {
      errorMsg.style.display = 'none';
    }
    return false;
  }
}

function calculateSimulation(capital, pac, years, rate) {
  const months = years * 12;
  const monthlyRate = Math.pow(1 + (rate / 100), 1 / 12) - 1; // Equivalente mensile esatto
  
  let balance = capital;
  let totalInvested = capital;
  
  const tableBody = document.getElementById('simulator-table-body');
  tableBody.innerHTML = '';
  
  // Anno 0 (Stato iniziale)
  const row0 = document.createElement('tr');
  row0.innerHTML = `
    <td>Anno 0 (Inizio)</td>
    <td>${formatCurrency(totalInvested)}</td>
    <td>€ 0</td>
    <td>${formatCurrency(balance)}</td>
  `;
  tableBody.appendChild(row0);
  
  // Ciclo dei mesi — formula: C_mese = C_prev × (1 + r_mensile) + PAC
  for (let m = 1; m <= months; m++) {
    totalInvested += pac;
    balance = balance * (1 + monthlyRate) + pac;
    
    // Scrittura riga ad ogni fine anno
    if (m % 12 === 0) {
      const year = m / 12;
      const interests = balance - totalInvested;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>Anno ${year}</td>
        <td>${formatCurrency(totalInvested)}</td>
        <td>${formatCurrency(interests)}</td>
        <td>${formatCurrency(balance)}</td>
      `;
      tableBody.appendChild(row);
    }
  }
  
  const finalTotal = balance;
  const finalInvested = totalInvested;
  const finalInterests = finalTotal - finalInvested;
  
  // Scrittura dei valori finali
  document.getElementById('res-invested').textContent = formatCurrency(finalInvested);
  document.getElementById('res-interests').textContent = formatCurrency(finalInterests);
  document.getElementById('res-total').textContent = formatCurrency(finalTotal);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

// ==========================================================================
// LOGICA AI INVESTMENT ADVISOR (CHAT & AUTOCOMPILAZIONE)
// ==========================================================================
function initAIAdvisor() {
  const chatWindow = document.getElementById('ai-chat-window');
  const chatForm = document.getElementById('ai-chat-form');
  const chatInput = document.getElementById('ai-chat-input');
  
  // Listener per i badge di prompt rapido
  document.querySelectorAll('.preset-badge').forEach(badge => {
    badge.addEventListener('click', () => {
      const preset = badge.getAttribute('data-preset');
      handleAIPreset(preset);
    });
  });

  // Gestione dell'invio manuale del prompt in chat
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;
    
    // Inserisce messaggio dell'utente in chat
    appendChatMessage('user', query);
    chatInput.value = '';
    
    // Esegue logica AI basata sulle parole chiave della richiesta
    processAIQuery(query);
  });
}

function appendChatMessage(sender, text) {
  const chatWindow = document.getElementById('ai-chat-window');
  const msg = document.createElement('div');
  msg.className = `chat-message ${sender}`;
  msg.innerHTML = `<div class="message-bubble">${text}</div>`;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msg;
}

function showTypingIndicator() {
  const chatWindow = document.getElementById('ai-chat-window');
  const msg = document.createElement('div');
  msg.className = 'chat-message ai';
  msg.id = 'typing-indicator';
  msg.innerHTML = `
    <div class="message-bubble">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>
  `;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}

// Funzione di compilazione automatica degli strumenti nel modulo simulatore
function applyPortfolioAllocation(allocationList) {
  const selectionList = document.getElementById('portfolio-selection-list');
  const checks = selectionList.querySelectorAll('.portfolio-item-check');
  const weights = selectionList.querySelectorAll('.portfolio-item-weight');
  
  // 1. Reset completo del form
  checks.forEach(check => {
    check.checked = false;
    const row = check.closest('.portfolio-selection-item');
    row.querySelector('.portfolio-item-right').style.display = 'none';
  });
  weights.forEach(input => {
    input.value = 0;
  });

  // 2. Applica la nuova allocazione ponderata
  allocationList.forEach(item => {
    const check = selectionList.querySelector(`.portfolio-item-check[data-id="${item.id}"]`);
    if (check) {
      check.checked = true;
      const row = check.closest('.portfolio-selection-item');
      row.querySelector('.portfolio-item-right').style.display = 'flex';
      
      const input = row.querySelector('.portfolio-item-weight');
      input.value = item.weight;
    }
  });

  // 3. Ricalcola i pesi ed innesca la simulazione in tempo reale
  updateWeightCounter();
  document.getElementById('simulator-form').dispatchEvent(new Event('submit'));
  setTimeout(() => {
    document.getElementById('simulator-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
}

// Risposta ai preset rapidi dell'AI
function handleAIPreset(preset) {
  showTypingIndicator();
  
  setTimeout(() => {
    removeTypingIndicator();
    
    let responseText = "";
    let allocation = [];
    
    if (preset === 'cauto') {
      responseText = `
        Ho configurato per te un **Portafoglio Conservativo** focalizzato sulla conservazione del capitale e sulla generazione di cedole sicure.
        <br><br>
        <strong>Struttura Allocata:</strong>
        <ul>
          <li><em>40% Global Bond ETF (AGGH)</em> e <em>20% US Treasury a 2 Anni (US2Y)</em>: per massimizzare la stabilità e assicurare liquidità costante priva di rischio tasso elevato.</li>
          <li><em>15% Titolo di Stato Italiano (BTP10Y)</em>: inserito per incrementare il rendimento complessivo della cedola, supportato dagli scudi BCE.</li>
          <li><em>15% Oro Fisico (Gold)</em>: protezione strutturale antinflazione.</li>
          <li><em>10% Azioni Coca-Cola (KO)</em>: bene rifugio difensivo che distribuisce dividendi crescenti.</li>
        </ul>
        Rendimento atteso calcolato: <strong>~4.71%</strong> con un profilo di rischio **Minimo 🛡️**. Ho già impostato i pesi nel configuratore!
      `;
      allocation = AI_PORTFOLIOS.cauto;
    } else if (preset === 'bilanciato') {
      responseText = `
        Ho configurato per te un **Portafoglio Bilanciato Globale**, ottimizzato per battere l'inflazione mantenendo una volatilità moderata.
        <br><br>
        <strong>Struttura Allocata:</strong>
        <ul>
          <li><em>35% Vanguard All-World ETF (VWCE)</em> e <em>20% S&P 500 ETF (SPY)</em>: l'ancora di crescita azionaria globale ed americana su oltre 3600 aziende.</li>
          <li><em>15% Oro Fisico (GLD)</em>: come bene rifugio contro i rischi geopolitici attivi.</li>
          <li><em>15% US Treasury a 10 Anni (US10Y)</em>: per bloccare rendimenti interessanti nel lungo termine.</li>
          <li><em>10% Apple (AAPL)</em>: per esporsi alla forte stabilità del leader tecnologico.</li>
          <li><em>5% Bitcoin (BTC)</em>: una minima quota (riserva digitale) inserita per accrescere i rendimenti senza compromettere la sicurezza globale.</li>
        </ul>
        Rendimento atteso calcolato: <strong>~8.20%</strong> con un profilo di rischio **Basso-Medio ⚖️**. Ho già impostato i pesi nel configuratore!
      `;
      allocation = AI_PORTFOLIOS.bilanciato;
    } else if (preset === 'aggressivo') {
      responseText = `
        Ho configurato per te un **Portafoglio Aggressivo Tech & Crypto**, progettato per massimizzare l'accumulo patrimoniale di lungo termine assumendosi rischi controllati nel settore della tecnologia avanzata.
        <br><br>
        <strong>Struttura Allocata:</strong>
        <ul>
          <li><em>30% Nasdaq 100 ETF (QQQ)</em>: diversificazione sulle 100 maggiori società non finanziarie ad altissimo tasso d'innovazione.</li>
          <li><em>25% Nvidia (NVDA)</em> e <em>10% ASML (ASML)</em>: esposizione diretta ai chipmaker del monopolio globale dell'Intelligenza Artificiale.</li>
          <li><em>20% Bitcoin (BTC)</em>: l'asset più performante dell'ultimo decennio a forte crescita matematica.</li>
          <li><em>15% Apple (AAPL)</em>: per fornire un cuscinetto di cassa ed ecosistema stabile al portafoglio.</li>
        </ul>
        Rendimento atteso calcolato: <strong>~13.78%</strong> con un profilo di rischio **Alto ⚡**. Le percentuali sono state configurate all'istante!
      `;
      allocation = AI_PORTFOLIOS.aggressivo;
    }
    
    appendChatMessage('ai', responseText);
    applyPortfolioAllocation(allocation);
    
  }, 1000);
}

// Analisi semantica rudimentale ma molto potente per il prompt testuale manuale
function processAIQuery(query) {
  showTypingIndicator();
  const lowerQuery = query.toLowerCase();
  
  setTimeout(() => {
    removeTypingIndicator();
    
    let responseText = "";
    let allocation = [];
    
    // Caso 1: Richiesta di basso rischio / pensione / cauto / obbligazioni
    if (lowerQuery.includes('pension') || lowerQuery.includes('cauto') || lowerQuery.includes('basso risch') || lowerQuery.includes('difensiv') || lowerQuery.includes('obbligazion') || lowerQuery.includes('sicur')) {
      responseText = `
        Ho analizzato la tua richiesta orientata alla **sicurezza del capitale ed a un basso rischio**. 
        Per far fronte ad obiettivi difensivi, ho configurato una combinazione focalizzata su titoli di stato a breve termine, obbligazioni investment grade globali, beni fisici (oro) e azioni ad altissima stabilità di dividendi.
        <br><br>
        <strong>Allocazione impostata:</strong>
        <ul>
          <li><strong>40% ETF Obbligazionario Globale (AGGH)</strong> e <strong>20% US Treasury 2 Anni (US2Y)</strong> come asse portante a rischio nullo.</li>
          <li><strong>15% Buoni del Tesoro Italiani (BTP10Y)</strong> per aumentare il rendimento cedolare fisso.</li>
          <li><strong>15% Oro Spot (Gold)</strong> per tutelarci dalle fluttuazioni geopolitiche attive.</li>
          <li><strong>10% Coca-Cola (KO)</strong>, leader dei consumi anticiclici con dividendi garantiti da 60 anni.</li>
        </ul>
        Il rendimento medio annuo ponderato stimato è di **~4.71%** con un profilo di rischio **Minimo 🛡️**. La simulazione è stata avviata con successo!
      `;
      allocation = AI_PORTFOLIOS.cauto;
    }
    // Caso 2: Richiesta aggressiva / tech / crypto / rischiare / nvidia / bitcoin
    else if (lowerQuery.includes('rischia') || lowerQuery.includes('aggressiv') || lowerQuery.includes('tech') || lowerQuery.includes('crypto') || lowerQuery.includes('bitcoin') || lowerQuery.includes('nvidia') || lowerQuery.includes('crescita')) {
      responseText = `
        Ho interpretato la tua richiesta e configurato una strategia **Aggressiva ad alto rendimento atteso**, ottimizzata per la massimizzazione della crescita patrimoniale sfruttando i mega-trend della tecnologia e delle criptovalute.
        <br><br>
        <strong>Allocazione impostata:</strong>
        <ul>
          <li><strong>30% Nasdaq-100 ETF (QQQ)</strong> per avere una diversificazione solida sui giganti innovatori.</li>
          <li><strong>25% Nvidia (NVDA)</strong> e <strong>10% ASML (ASML)</strong> per possedere il monopolio dell'hardware dell'Intelligenza Artificiale.</li>
          <li><strong>20% Bitcoin (BTC)</strong> come riserva algoritmica deflazionistica a massima asimmetria di rendimento.</li>
          <li><strong>15% Apple (AAPL)</strong> come stabilizzatore di portafoglio a forte generazione di cassa.</li>
        </ul>
        Questa allocazione presenta un rendimento storico-ponderato stimato del **~13.78%** ed un profilo di rischio **Alto ⚡**. Ho configurato i dati nel configuratore a sinistra e lanciato il calcolo!
      `;
      allocation = AI_PORTFOLIOS.aggressivo;
    }
    // Caso 3: Anti-inflazione / oro / stagflazione / svalutazione
    else if (lowerQuery.includes('inflazion') || lowerQuery.includes('stagflazion') || lowerQuery.includes('copertura') || lowerQuery.includes('svalut') || lowerQuery.includes('erosion') || lowerQuery.includes('potere d\'acquisto')) {
      responseText = `
        Ho rilevato una preoccupazione per l'<strong>inflazione e la svalutazione monetaria</strong>. Ho configurato per te un portafoglio <strong>Anti-Inflazione (Inflation Hedge)</strong>, il cui asse portante è la protezione reale del potere d'acquisto attraverso metalli preziosi e obbligazioni a bassa duration.
        <br><br>
        <strong>Struttura Allocata:</strong>
        <ul>
          <li><em>30% ETF Obbligazionario Globale (AGGH)</em>: ancora obbligazionaria investment grade, immunizzata dal rischio valutario tramite EUR Hedging.</li>
          <li><em>25% SPDR Gold Shares (GLD)</em> + <em>20% Oro Spot (GOLD)</em>: doppia esposizione all'oro fisico, l'asset rifugio per eccellenza contro l'erosione monetaria sistemica.</li>
          <li><em>15% S&P 500 ETF (SPY)</em>: quota azionaria per mantenere un'esposizione alla crescita nominale che storicamente supera l'inflazione nel lungo periodo.</li>
          <li><em>10% Coca-Cola (KO)</em>: dividendi difensivi costanti, con pricing power robusto anche in contesti ad alta inflazione dei consumi.</li>
        </ul>
        Rendimento atteso stimato: <strong>~6.00%</strong> con profilo di rischio <strong>Basso-Medio ⚖️</strong>. Il modulo è stato autocompilato!
      `;
      allocation = [
        { id: "aggh", weight: 30 },
        { id: "gld",  weight: 25 },
        { id: "gold", weight: 20 },
        { id: "spy",  weight: 15 },
        { id: "ko",   weight: 10 }
      ];
    }
    // Caso 4: Fallback / Bilanciato standard
    else {
      responseText = `
        Ricevuto! In base alla tua richiesta, ti ho strutturato un **Portafoglio Bilanciato Globale (All-Weather)**.
        È un'allocazione estremamente solida progettata per catturare la crescita economica globale tramite l'azionario diversificato (55%), proteggendosi dall'inflazione e dai rischi di instabilità dei blocchi (USA-Cina) tramite l'oro (15%), obbligazioni decennali (15%) e una piccola percentuale esplorativa di Bitcoin (5%).
        <br><br>
        <strong>Composizione del Portafoglio:</strong>
        <ul>
          <li><strong>35% Vanguard FTSE All-World (VWCE)</strong>: diversificazione azionaria planetaria su oltre 3600 aziende.</li>
          <li><strong>20% ETF S&P 500 (SPY)</strong>: concentrazione sui leader ad alta capitalizzazione statunitensi.</li>
          <li><strong>15% Oro Spot (GLD)</strong>: la riserva monetaria anti-crisi e geopolitica per eccellenza.</li>
          <li><strong>15% Obbligazioni USA 10 Anni (US10Y)</strong>: stabilità garantita dal governo USA.</li>
          <li><strong>10% Apple (AAPL)</strong>: innovatore di consumer tech solido.</li>
          <li><strong>5% Bitcoin (BTC)</strong>: ottimizzazione del rendimento sul lungo termine.</li>
        </ul>
        Rendimento stimato del portafoglio: **~8.20%** con profilo di rischio **Basso-Medio ⚖️**. Il modulo di simulazione a sinistra è stato autocompilato ed è pronto!
      `;
      allocation = AI_PORTFOLIOS.bilanciato;
    }
    
    appendChatMessage('ai', responseText);
    applyPortfolioAllocation(allocation);
    
  }, 1200);
}
