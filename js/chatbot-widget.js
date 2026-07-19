/**
 * chatbot-widget.js — Asistente flotante KAVARI (todas las páginas)
 */
(function () {
  let ctx = { country: null, guias: [], aerolineas: [], hospedajes: [] };
  let opened = false;
  let welcomeShown = false;

  const generalQuestionsES = [
    { q: '¿Cómo busco un destino?', key: 'destino' },
    { q: '¿Dónde encuentro guías turísticos?', key: 'guía' },
    { q: '¿Cómo cambio el idioma o modo oscuro?', key: 'idioma' },
    { q: '¿Hay paquetes de viaje disponibles?', key: 'paquete' }
  ];

  const generalQuestionsEN = [
    { q: 'How do I find a destination?', key: 'destination' },
    { q: 'Where can I find tourist guides?', key: 'guide' },
    { q: 'How do I change language or dark mode?', key: 'language' },
    { q: 'Are travel packages available?', key: 'package' },
    { q: 'How do I create my account?', key: 'account' },
    { q: 'Which KAVARI plans are available?', key: 'plans' }
  ];

  function lang() {
    return localStorage.getItem('kavari-idioma') || localStorage.getItem('kavariIdioma') || localStorage.getItem('idioma') || 'es';
  }

  function getDestinationQuestions(d) {
    const n = d.nombre;
    const en = lang() === 'en';
    if (en) {
      return [
        { q: `Best time to visit ${n}?`, text: `What is the best time to visit ${n}?` },
        { q: 'What documents do I need?', text: 'What documents do I need to enter?' },
        { q: 'Must-see places?', text: `What are the must-see places in ${n}?` },
        { q: 'Typical food to try?', text: `What typical food should I try in ${n}?` },
        { q: 'How much does it cost?', text: `How much does it cost to travel to ${n}?` }
      ];
    }
    return [
      { q: `¿Mejor época para visitar ${n}?`, text: `¿Cuál es la mejor época para visitar ${n}?` },
      { q: '¿Qué documentos necesito?', text: '¿Qué documentos necesito para entrar?' },
      { q: '¿Destinos imperdibles?', text: `¿Cuáles son los destinos imperdibles en ${n}?` },
      { q: '¿Qué platos típicos probar?', text: `¿Qué platos típicos debo probar en ${n}?` },
      { q: '¿Cuánto cuesta viajar?', text: `¿Cuánto cuesta viajar a ${n}?` }
    ];
  }

  function injectWidget() {
    if (document.getElementById('kavari-chat-root')) return;

    const root = document.createElement('div');
    root.id = 'kavari-chat-root';
    root.innerHTML = `
      <button id="kavari-chat-btn" type="button" aria-label="Abrir asistente KAVARI" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      <div id="kavari-asistente" role="dialog" aria-label="Asistente KAVARI">
        <div id="kavari-mascot" aria-hidden="true">
          <div class="kavari-mascot-inner"><img src="img/mascota.png" alt="Mascot"></div>
        </div>
        <div id="kavari-chat-panel">
          <div id="kavari-chat-header">
            <div>
              <strong id="kavari-chat-title">KAVARI Asistente</strong>
              <span id="kavari-chat-subtitle">Tu guía de viaje</span>
            </div>
            <button id="kavari-chat-close" type="button" aria-label="Cerrar">&times;</button>
          </div>
          <div id="kavari-mensajes"></div>
          <div id="kavari-preguntas"></div>
          <div id="kavari-chat-input-row">
            <input type="text" id="kavari-chat-input" placeholder="Escribe tu pregunta..." autocomplete="off">
            <button id="kavari-chat-send" type="button" aria-label="Enviar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(root);
    bindEvents();
    refreshUI();
  }

  function bindEvents() {
    document.getElementById('kavari-chat-btn').addEventListener('click', toggle);
    document.getElementById('kavari-chat-close').addEventListener('click', close);
    document.getElementById('kavari-chat-send').addEventListener('click', sendFromInput);
    document.getElementById('kavari-chat-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') sendFromInput();
    });
    window.addEventListener('kavari:langchange', refreshUI);
  }

  function toggle() {
    opened ? close() : open();
  }

  function open() {
    opened = true;
    document.getElementById('kavari-asistente').classList.add('activo');
    document.getElementById('kavari-chat-btn').classList.add('activo');
    document.getElementById('kavari-chat-btn').setAttribute('aria-expanded', 'true');
    if (!welcomeShown) showWelcome();
    renderQuestions();
  }

  function close() {
    opened = false;
    const panel = document.getElementById('kavari-asistente');
    panel.classList.add('cerrando');
    panel.classList.remove('activo');
    document.getElementById('kavari-chat-btn').classList.remove('activo');
    document.getElementById('kavari-chat-btn').setAttribute('aria-expanded', 'false');
    setTimeout(() => panel.classList.remove('cerrando'), 300);
  }

  function showWelcome() {
    welcomeShown = true;
    const en = lang() === 'en';
    const d = ctx.country;
    let html;
    if (d?.nombre) {
      html = en
        ? `Hello! I'm your KAVARI assistant for <strong>${d.nombre}</strong>. Pick a question or type your own.`
        : `¡Hola! Soy tu asistente KAVARI para <strong>${d.nombre}</strong>. Elige una pregunta o escribe la tuya.`;
    } else {
      html = en
        ? 'Hello! I\'m the KAVARI assistant. Ask about destinations, guides, packages or settings.'
        : '¡Hola! Soy el asistente KAVARI. Pregúntame sobre destinos, guías, paquetes o configuración.';
    }
    addBotMessage(html, true);
  }

  function renderQuestions() {
    const box = document.getElementById('kavari-preguntas');
    if (!box) return;
    box.innerHTML = '';

    const items = ctx.country?.nombre
      ? getDestinationQuestions(ctx.country)
      : (lang() === 'en' ? generalQuestionsEN : generalQuestionsES).map(i => ({ q: i.q, text: i.q, key: i.key }));

    items.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kb-pregunta-btn';
      btn.textContent = item.q;
      btn.addEventListener('click', () => handleQuestion(item.text || item.q));
      box.appendChild(btn);
    });
  }

  function refreshUI() {
    const en = lang() === 'en';
    const title = document.getElementById('kavari-chat-title');
    const subtitle = document.getElementById('kavari-chat-subtitle');
    const input = document.getElementById('kavari-chat-input');
    if (title) title.textContent = en ? 'KAVARI Assistant' : 'Asistente KAVARI';
    if (subtitle) {
      subtitle.textContent = ctx.country?.nombre
        ? (en ? `Specialized in ${ctx.country.nombre}` : `Especializado en ${ctx.country.nombre}`)
        : (en ? 'Your travel guide' : 'Tu guía de viaje');
    }
    if (input) input.placeholder = en ? 'Type your question...' : 'Escribe tu pregunta...';
    if (opened) renderQuestions();
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'kb-msg-user';
    div.textContent = text;
    const box = document.getElementById('kavari-mensajes');
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function addBotMessage(html, isWelcome) {
    const div = document.createElement('div');
    div.className = isWelcome ? 'kb-msg-welcome' : 'kb-msg-bot';
    div.innerHTML = html;
    const box = document.getElementById('kavari-mensajes');
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function handleQuestion(text) {
    addUserMessage(text);
    setTimeout(() => {
      const q = text.toLowerCase();
      let response;
      if (ctx.country?.nombre && typeof generateChatResponse === 'function') {
        response = generateChatResponse(q, ctx);
      } else if (typeof generateGeneralResponse === 'function') {
        response = generateGeneralResponse(q);
      } else {
        response = lang() === 'en' ? 'How can I help you?' : '¿En qué puedo ayudarte?';
      }
      addBotMessage(response);
    }, 450);
  }

  function sendFromInput() {
    const input = document.getElementById('kavari-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    handleQuestion(text);
  }

  function setContext(newCtx) {
    ctx = {
      country: newCtx?.country || newCtx || null,
      guias: newCtx?.guias || [],
      aerolineas: newCtx?.aerolineas || [],
      hospedajes: newCtx?.hospedajes || []
    };
    welcomeShown = false;
    const msgs = document.getElementById('kavari-mensajes');
    if (msgs) msgs.innerHTML = '';
    refreshUI();
    if (opened) showWelcome();
  }

  window.KavariChatbot = { setContext, open, close, toggle };

  document.addEventListener('DOMContentLoaded', () => {
    injectWidget();
    tryLoadCountryFromStorage();
  });

  async function tryLoadCountryFromStorage() {
    const code = localStorage.getItem('paisSeleccionado');
    if (!code) return;
    try {
      const res = await fetch('data/data.json');
      const all = await res.json();
      if (!all[code]) return;
      const d = all[code];
      setContext({
        country: d,
        guias: d.guias || [],
        aerolineas: d.aerolineas || [],
        hospedajes: d.hospedajes || []
      });
    } catch (e) { /* ignore */ }
  }
})();

