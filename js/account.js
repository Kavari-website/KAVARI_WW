/* Cuenta local de KAVARI: la sesión vive únicamente en este navegador. */
(function () {
  const key = 'kavari-user';
  const planKey = 'kavari-plan';
  const lang = () => localStorage.getItem('kavari-idioma') || 'es';
  const getUser = () => { try { return JSON.parse(localStorage.getItem(key)); } catch (_) { return null; } };
  const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  function renderNavAccount() {
    document.getElementById('kavari-nav-account')?.remove();
    const destinationNav = document.querySelector('.page-destino .nav-links');
    const target = destinationNav || document.querySelector('.nav-actions') || document.querySelector('.topbar-nav') || document.querySelector('.navbar, .topbar');
    if (!target) return;
    const user = getUser(), en = lang() === 'en';
    const wrap = document.createElement(destinationNav ? 'li' : 'div'); wrap.id = 'kavari-nav-account'; wrap.className = 'kavari-nav-account';
    const planLabel = en ? 'Plans' : 'Planes';
    const accountLabel = user ? `👤 ${escapeHtml(user.name)}` : (en ? 'Log in / Join' : 'Ingresar / Unirme');
    wrap.innerHTML = `<a href="planes.html" class="kavari-nav-plan">${planLabel}</a><a href="cuenta.html" class="kavari-nav-user">${accountLabel}</a>`;
    target.appendChild(wrap);
  }
  window.KavariAccount = {
    getUser,
    getPlan: () => localStorage.getItem(planKey) || 'viajero',
    save(user) { localStorage.setItem(key, JSON.stringify(user)); renderNavAccount(); },
    setPlan(plan) { localStorage.setItem(planKey, plan); },
    logout() { localStorage.removeItem(key); renderNavAccount(); }
  };
  document.addEventListener('DOMContentLoaded', renderNavAccount);
  window.addEventListener('kavari:langchange', renderNavAccount);
})();
