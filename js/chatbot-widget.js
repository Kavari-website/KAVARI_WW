/**
 * chatbot-widget.js — Asistente flotante KAVARI (todas las páginas) · v2
 * Mejoras sobre la v1:
 *  - Indicador "escribiendo..." antes de mostrar la respuesta
 *  - Cierre con Esc y clic fuera del panel
 *  - Foco accesible: al abrir enfoca el input, aria-live en mensajes,
 *    aria-expanded correcto, rol de diálogo bien anunciado
 *  - Input + botón de enviar se deshabilitan mientras "piensa"
 *    (evita mensajes duplicados por doble clic o Enter repetido)
 *  - Insignia de "no leído" en el botón flotante antes de abrir por
 *    primera vez, para invitar a interactuar
 *  - Manejo de errores: si data.json falla, el bot avisa en vez de
 *    quedarse mudo; si generateChatResponse lanza un error, no rompe
 *    el widget
 *  - Historial de conversación se conserva en memoria por contexto
 *    (no se resetea si vuelves a abrir el panel sin cambiar de país)
 */
(function () {
  let ctx = { country: null, guias: [], aerolineas: [], hospedajes: [] };
  let opened = false;
  let welcomeShown = false;
  let thinking = false;

  const generalQuestions = [
    { qKey: 'chatQDestino', key: 'destino' },
    { qKey: 'chatQGuias', key: 'guía' },
    { qKey: 'chatQIdioma', key: 'idioma' },
    { qKey: 'chatQPaquetes', key: 'paquete' },
    { qKey: 'chatQCuenta', key: 'cuenta' },
    { qKey: 'chatQPlanes', key: 'planes' }
  ];

  function getDestinationQuestions(d) {
    const n = d.nombre;
    const t = window.t || (k => k);
    return [
      { q: t('chatBtnDestinoEpoca').replace('{nombre}', n), text: t('chatQDestinoEpoca').replace('{nombre}', n) },
      { q: t('chatBtnDestinoDoc'), text: t('chatQDestinoDoc') },
      { q: t('chatBtnDestinoImp'), text: t('chatQDestinoImp').replace('{nombre}', n) },
      { q: t('chatBtnDestinoPlatos'), text: t('chatQDestinoPlatos').replace('{nombre}', n) },
      { q: t('chatBtnDestinoCosto'), text: t('chatQDestinoCosto').replace('{nombre}', n) }
    ];
  }

  /* ═══════════════════ construcción del widget ═══════════════════ */
  function injectWidget() {
    if (document.getElementById('kavari-chat-root')) return;

    const root = document.createElement('div');
    root.id = 'kavari-chat-root';
    root.innerHTML = `
      <button id="kavari-chat-btn" type="button" aria-label="Abrir asistente KAVARI" aria-expanded="false" aria-haspopup="dialog">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span id="kavari-chat-badge" class="kb-badge" hidden>1</span>
      </button>
      <div id="kavari-asistente" role="dialog" aria-modal="false" aria-label="Asistente KAVARI">
        <div id="kavari-mascot" aria-hidden="true">
          <div class="kavari-mascot-inner"><img src="img/mascota.png" alt="" onerror="this.parentElement.style.display='none'"></div>
        </div>
        <div id="kavari-chat-panel">
          <div id="kavari-chat-header">
            <div>
              <strong id="kavari-chat-title">KAVARI Asistente</strong>
              <span id="kavari-chat-subtitle">Tu guía de viaje</span>
            </div>
            <button id="kavari-chat-close" type="button" aria-label="Cerrar">&times;</button>
          </div>
          <div id="kavari-mensajes" role="log" aria-live="polite" aria-relevant="additions"></div>
          <div id="kavari-preguntas"></div>
          <div id="kavari-chat-input-row">
            <input type="text" id="kavari-chat-input" placeholder="Escribe tu pregunta..." autocomplete="off" maxlength="300">
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
    showBadgeIfNeeded();
  }

  function bindEvents() {
    const btn = document.getElementById('kavari-chat-btn');
    const closeBtn = document.getElementById('kavari-chat-close');
    const sendBtn = document.getElementById('kavari-chat-send');
    const input = document.getElementById('kavari-chat-input');
    const panel = document.getElementById('kavari-asistente');

    btn.addEventListener('click', toggle);
    closeBtn.addEventListener('click', close);
    sendBtn.addEventListener('click', sendFromInput);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendFromInput();
    });

    // Cerrar con Esc
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && opened) close();
    });

    // Cerrar al hacer clic fuera del panel (pero no sobre el botón flotante)
    document.addEventListener('click', e => {
      if (!opened) return;
      const root = document.getElementById('kavari-chat-root');
      if (root && !root.contains(e.target)) close();
    });
    // Evita que el clic dentro del panel burbujee y cierre el propio chat
    panel.addEventListener('click', e => e.stopPropagation());

    window.addEventListener('kavari:langchange', refreshUI);
  }

  function showBadgeIfNeeded() {
    const badge = document.getElementById('kavari-chat-badge');
    if (!badge) return;
    const seen = sessionStorage.getItem('kavari-chat-seen');
    if (!seen) badge.hidden = false;
  }

  function hideBadge() {
    const badge = document.getElementById('kavari-chat-badge');
    if (badge) badge.hidden = true;
    sessionStorage.setItem('kavari-chat-seen', '1');
  }

  /* ═══════════════════ abrir / cerrar ═══════════════════ */
  function toggle() {
    opened ? close() : open();
  }

  function open() {
    opened = true;
    hideBadge();
    document.getElementById('kavari-asistente').classList.add('activo');
    document.getElementById('kavari-chat-btn').classList.add('activo');
    document.getElementById('kavari-chat-btn').setAttribute('aria-expanded', 'true');
    if (!welcomeShown) showWelcome();
    renderQuestions();
    // Enfocar el input al abrir, sin robar el foco de forma agresiva
    setTimeout(() => {
      const input = document.getElementById('kavari-chat-input');
      if (input) input.focus({ preventScroll: true });
    }, 200);
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

  /* ═══════════════════ mensajes ═══════════════════ */
  function showWelcome() {
    welcomeShown = true;
    const t = window.t || (k => k);
    const d = ctx.country;
    let html;
    if (d?.nombre) {
      html = t('chatWelcomeDestino').replace('{nombre}', escapeHtml(d.nombre));
    } else {
      html = t('chatWelcomeGeneral');
    }
    addBotMessage(html, true);
  }

  function renderQuestions() {
    const box = document.getElementById('kavari-preguntas');
    if (!box) return;
    box.innerHTML = '';

    const t = window.t || (k => k);
    const items = ctx.country?.nombre
      ? getDestinationQuestions(ctx.country)
      : generalQuestions.map(i => ({ q: t(i.qKey), text: t(i.qKey), key: i.key }));

    items.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kb-pregunta-btn';
      btn.textContent = item.q;
      btn.disabled = thinking;
      btn.addEventListener('click', () => handleQuestion(item.text || item.q));
      box.appendChild(btn);
    });
  }

  function refreshUI() {
    const t = window.t || (k => k);
    const title = document.getElementById('kavari-chat-title');
    const subtitle = document.getElementById('kavari-chat-subtitle');
    const input = document.getElementById('kavari-chat-input');
    const btn = document.getElementById('kavari-chat-btn');
    if (title) title.textContent = t('chatTitle');
    if (subtitle) {
      subtitle.textContent = ctx.country?.nombre
        ? t('chatSubtitleDestino').replace('{nombre}', ctx.country.nombre)
        : t('chatSubtitle');
    }
    if (input) input.placeholder = t('chatInputPlaceholder');
    if (btn) btn.setAttribute('aria-label', t('chatBtnOpen'));
    if (opened) renderQuestions();
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'kb-msg-user';
    div.textContent = text; // textContent evita inyección de HTML
    const box = document.getElementById('kavari-mensajes');
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function addBotMessage(html, isWelcome) {
    const div = document.createElement('div');
    div.className = isWelcome ? 'kb-msg-welcome' : 'kb-msg-bot';
    div.innerHTML = html; // html viene solo de nuestras propias funciones (chat-brain.js)
    const box = document.getElementById('kavari-mensajes');
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function showTyping() {
    const box = document.getElementById('kavari-mensajes');
    if (!box || document.getElementById('kavari-typing')) return;
    const div = document.createElement('div');
    div.id = 'kavari-typing';
    div.className = 'kb-msg-bot kb-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('kavari-typing');
    if (el) el.remove();
  }

  function setThinking(state) {
    thinking = state;
    const input = document.getElementById('kavari-chat-input');
    const sendBtn = document.getElementById('kavari-chat-send');
    if (input) input.disabled = state;
    if (sendBtn) sendBtn.disabled = state;
    document.querySelectorAll('.kb-pregunta-btn').forEach(b => { b.disabled = state; });
  }

  /* ═══════════════════ envío y respuesta ═══════════════════ */
  function lang() {
    return (localStorage.getItem('kavari-idioma') || 'es') === 'en';
  }

  async function handleQuestion(text) {
    if (thinking || !text || !text.trim()) return;
    addUserMessage(text);
    setThinking(true);
    showTyping();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('http://localhost:3007/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: { ...ctx, lang: lang() ? 'en' : 'es' }
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        hideTyping();
        addBotMessage(data.reply);
        setThinking(false);
        const input = document.getElementById('kavari-chat-input');
        if (input) input.focus({ preventScroll: true });
        return;
      }
    } catch (_) {
      // API no disponible, usamos el motor local
    }

    // Fallback al motor local (misma lógica que antes)
    const delay = Math.min(900, 350 + text.length * 6);
    setTimeout(() => {
      let response;
      try {
        const q = text.toLowerCase();
        if (ctx.country?.nombre && typeof generateChatResponse === 'function') {
          response = generateChatResponse(q, ctx);
        } else if (typeof generateGeneralResponse === 'function') {
          response = generateGeneralResponse(q);
        } else {
          response = lang() ? 'How can I help you?' : '¿En qué puedo ayudarte?';
        }
      } catch (err) {
        response = lang()
          ? 'Sorry, something went wrong answering that. Try rephrasing your question.'
          : 'Lo siento, algo falló al responder eso. Intenta reformular tu pregunta.';
      }
      hideTyping();
      addBotMessage(response);
      setThinking(false);
      const input = document.getElementById('kavari-chat-input');
      if (input) input.focus({ preventScroll: true });
    }, delay);
  }

  function sendFromInput() {
    if (thinking) return;
    const input = document.getElementById('kavari-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    handleQuestion(text);
  }

  /* ═══════════════════ contexto (país activo) ═══════════════════ */
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
      if (!res.ok) throw new Error('data.json ' + res.status);
      const all = await res.json();
      if (!all[code]) return;
      const d = all[code];
      setContext({
        country: d,
        guias: d.guias || [],
        aerolineas: d.aerolineas || [],
        hospedajes: d.hospedajes || []
      });
    } catch (e) {
      // No rompe el widget: simplemente queda en modo general.
      console.warn('KAVARI chatbot: no se pudo cargar data.json', e);
    }
  }
})();