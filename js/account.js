/* Cuenta local de KAVARI: la sesión vive únicamente en este navegador. */
(function () {
  const KEY = 'kavari-user';
  const PLAN_KEY = 'kavari-plan';
  const VALID_PLANS = ['viajero', 'premium', 'op'];

  const lang = () => localStorage.getItem('kavari-idioma') || 'es';

  const escapeHtml = value =>
    String(value ?? '').replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
    })[char]);

  function getUser() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const user = JSON.parse(raw);
      if (!user || typeof user !== 'object' || !user.name || !user.email) return null;
      return user;
    } catch (_) {
      return null;
    }
  }

  function getPlan() {
    const plan = localStorage.getItem(PLAN_KEY);
    return VALID_PLANS.includes(plan) ? plan : 'viajero';
  }

  function save(user) {
    const clean = {
      name: String(user?.name || '').trim().slice(0, 80),
      email: String(user?.email || '').trim().toLowerCase().slice(0, 120),
    };
    if (!clean.name || !clean.email) return false;
    localStorage.setItem(KEY, JSON.stringify(clean));
    renderNavAccount();
    return true;
  }

  function setPlan(plan) {
    if (!VALID_PLANS.includes(plan)) return false;
    localStorage.setItem(PLAN_KEY, plan);
    renderNavAccount();
    return true;
  }

  function logout() {
    localStorage.removeItem(KEY);
    renderNavAccount();
  }

  function renderNavAccount() {
    document.getElementById('kavari-nav-account')?.remove();
    const destinationNav = document.querySelector('.page-destino .nav-links');
    const target = destinationNav
      || document.querySelector('.nav-actions')
      || document.querySelector('.topbar-nav')
      || document.querySelector('.navbar, .topbar');
    if (!target) return;

    const user = getUser();
    const en = lang() === 'en';
    const wrap = document.createElement(destinationNav ? 'li' : 'div');
    wrap.id = 'kavari-nav-account';
    wrap.className = 'kavari-nav-account';

    const planLabel = window.t ? window.t('planesNavPlanes') : (en ? 'Plans' : 'Planes');
    const loginLabel = window.t ? window.t('planesNavMiCuenta') : (en ? 'My account' : 'Mi cuenta');
    const accountLabel = user
      ? `👤 ${escapeHtml(user.name)}`
      : loginLabel;

    wrap.innerHTML =
      `<a href="planes.html" class="kavari-nav-plan">${planLabel}</a>` +
      `<a href="cuenta.html" class="kavari-nav-user">${accountLabel}</a>`;

    target.appendChild(wrap);
  }

  window.KavariAccount = {
    getUser,
    getPlan,
    save,
    setPlan,
    logout,
    escapeHtml,
  };

  document.addEventListener('DOMContentLoaded', renderNavAccount);
  window.addEventListener('kavari:langchange', renderNavAccount);
})();
/* Controlador de la vista de cuenta (tarjeta de embarque KAVARI). */
(function () {
  const root = document.getElementById('accountCard');
  if (!root || !window.KavariAccount) return;

  const esc = window.KavariAccount.escapeHtml;
  let mode = 'join';

  const PLAN_NAMES = { viajero: 'Viajero Gratis', premium: 'Premium', op: 'OP' };
  const planName = plan => PLAN_NAMES[plan] || plan;

  function loggedInView(user) {
    const t = window.t || (k => k);
    root.innerHTML = `
      <h2>${t('cuentaHola').replace('{name}', esc(user.name))}</h2>
      <p>${t('cuentaActiva')}</p>
      <div class="auth-user">
        <div class="ticket-grid">
          <div class="ticket-field"><span>${t('cuentaPasajero')}</span><strong>${esc(user.name)}</strong></div>
          <div class="ticket-field"><span>${t('cuentaCorreo')}</span><strong>${esc(user.email)}</strong></div>
          <div class="ticket-plan">
            <span class="plan-badge">PLAN · ${esc(planName(window.KavariAccount.getPlan()))}</span>
            <a class="manage-link" href="planes.html">${t('cuentaGestionar')}</a>
          </div>
        </div>
        <button type="button" id="logout">${t('cuentaCerrarSesion')}</button>
      </div>`;
    document.getElementById('logout').onclick = () => {
      window.KavariAccount.logout();
      render();
    };
  }

  function formView() {
    const t = window.t || (k => k);
    const isJoin = mode === 'join';
    root.innerHTML = `
      <h2>${isJoin ? t('cuentaUnete') : t('cuentaInicia')}</h2>
      <p>${isJoin ? t('cuentaCreaDesc') : t('cuentaAccedeDesc')}</p>

      <div class="auth-tabs" role="tablist" aria-label="Modo de acceso" data-mode="${mode}">
        <span class="tab-indicator" aria-hidden="true"></span>
        <button type="button" role="tab" id="tab-join" aria-selected="${isJoin}" aria-controls="form" class="${isJoin ? 'active' : ''}">${t('cuentaCrearTab')}</button>
        <button type="button" role="tab" id="tab-login" aria-selected="${!isJoin}" aria-controls="form" class="${!isJoin ? 'active' : ''}">${t('cuentaIngresarTab')}</button>
      </div>

      <form id="form" novalidate>
        <div class="auth-field">
          <label for="f-name">${t('cuentaNombreLabel')}</label>
          <div class="auth-input-wrap">
            <input id="f-name" name="name" required autocomplete="name" placeholder="${t('cuentaNombrePlaceholder')}">
          </div>
          <p class="auth-error" id="err-name" aria-live="polite"></p>
        </div>

        <div class="auth-field">
          <label for="f-email">${t('cuentaCorreoPlaceholder').split('@')[0] === 'tu' ? 'Correo electrónico' : 'Email'}</label>
          <div class="auth-input-wrap">
            <input id="f-email" name="email" type="email" required autocomplete="email" placeholder="${t('cuentaCorreoPlaceholder')}">
          </div>
          <p class="auth-error" id="err-email" aria-live="polite"></p>
        </div>

        <div class="auth-field">
          <label for="f-password">${t('cuentaPassLabel')}</label>
          <div class="auth-input-wrap">
            <input id="f-password" name="password" type="password" minlength="6" required
                   autocomplete="${isJoin ? 'new-password' : 'current-password'}" placeholder="${t('cuentaPassPlaceholder')}">
            <button type="button" class="pw-toggle" id="pw-toggle" aria-label="${t('cuentaPassVer')}">${t('cuentaPassVer')}</button>
          </div>
          <p class="auth-error" id="err-password" aria-live="polite"></p>
        </div>

        ${isJoin ? `<div class="auth-check"><label><input type="checkbox" id="f-terms" required> <span>${t('cuentaTerminos')}</span></label><p class="auth-error" id="err-terms" aria-live="polite"></p></div>` : ''}

        <button type="submit" class="auth-submit">${isJoin ? t('cuentaBtnCrear') : t('cuentaBtnIngresar')}</button>
      </form>
    `;

    document.getElementById('tab-join').onclick = () => { mode = 'join'; render(); };
    document.getElementById('tab-login').onclick = () => { mode = 'login'; render(); };

    const pwInput = document.getElementById('f-password');
    const pwToggle = document.getElementById('pw-toggle');
    pwToggle.onclick = () => {
      const showing = pwInput.type === 'text';
      pwInput.type = showing ? 'password' : 'text';
      pwToggle.textContent = showing ? 'Ver' : 'Ocultar';
      pwToggle.setAttribute('aria-label', showing ? 'Mostrar contraseña' : 'Ocultar contraseña');
    };

    document.getElementById('form').addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(event.target);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const password = String(data.get('password') || '');

      const errors = { name: '', email: '', password: '' };
      if (!name) errors.name = 'Escribe tu nombre.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Escribe un correo válido.';
      if (password.length < 6) errors.password = 'Usa al menos 6 caracteres.';

      let hasError = false;
      for (const field of ['name', 'email', 'password']) {
        const el = document.getElementById(`err-${field}`);
        if (el) el.textContent = errors[field];
        if (errors[field]) hasError = true;
      }
      if (hasError) return;

      window.KavariAccount.save({ name, email });
      render();
    });
  }

  function render() {
    const user = window.KavariAccount.getUser();
    if (user) {
      loggedInView(user);
    } else {
      formView();
    }
  }

  render();
})();