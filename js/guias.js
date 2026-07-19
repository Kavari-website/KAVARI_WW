// ========== STATE ==========
let guides = [];
let currentFilter = 'all';
let selectedRank = 'silver';
let selectedPaymentMethod = '';
let currentContactGuide = null;

const rankPrices = { silver: 20, gold: 35, diamond: 50 };
const rankHourlyRates = { silver: 20, gold: 35, diamond: 50 };

// ========== INIT ==========
function init() {
  const stored = localStorage.getItem('kavariGuides');
  if (stored) {
    guides = JSON.parse(stored);
  } else {
    guides = [
      { id: 1, name: "Mariana Estévez", description: "Especialista en turismo sostenible y avistamiento de aves. Certificada por la IATA. 10 años guiando expediciones únicas.", languages: "Español, Inglés, Francés", location: "Bocas del Toro", country: "panama", rank: "diamond", price: 50, photo: "https://randomuser.me/api/portraits/women/68.jpg", especialidades: ["Ecoturismo", "Aves", "Naturaleza"], disponible: true },
      { id: 2, name: "Ricardo Herrera", description: "Historiador urbano y guía de patrimonio. Especialista en cascos históricos, museos y arquitectura colonial.", languages: "Español, Portugués, Italiano", location: "Cartagena", country: "colombia", rank: "diamond", price: 50, photo: "https://randomuser.me/api/portraits/men/32.jpg", especialidades: ["Historia", "Arquitectura", "Arte"], disponible: true },
      { id: 3, name: "Camila Rojas", description: "Apasionada por la naturaleza y la caficultura. Recorridos por fincas cafeteras y senderismo de montaña.", languages: "Español, Inglés", location: "Quindío", country: "colombia", rank: "gold", price: 35, photo: "https://randomuser.me/api/portraits/women/45.jpg", especialidades: ["Café", "Senderismo", "Naturaleza"], disponible: true },
      { id: 4, name: "Jorge Lasso", description: "Conductor de experiencias culturales nocturnas. Especialista en leyendas, gastronomía y vida urbana.", languages: "Español, Inglés", location: "Ciudad de Guatemala", country: "guatemala", rank: "gold", price: 35, photo: "https://randomuser.me/api/portraits/men/79.jpg", especialidades: ["Cultura", "Gastronomía", "Historia"], disponible: false },
      { id: 5, name: "Laura Villanueva", description: "Guía de aventura y rafting. 5 años dirigiendo grupos en ríos de montaña y actividades de alto impacto.", languages: "Español, Inglés", location: "La Fortuna", country: "costa-rica", rank: "silver", price: 20, photo: "https://randomuser.me/api/portraits/women/22.jpg", especialidades: ["Aventura", "Rafting", "Senderismo"], disponible: true },
      { id: 6, name: "Carlos Mejía", description: "Experto en el Canal de Panamá e historia colonial. Guía certificado en Casco Viejo y San Blas desde hace 12 años.", languages: "Español, Inglés", location: "Ciudad de Panamá", country: "panama", rank: "gold", price: 35, photo: "https://randomuser.me/api/portraits/men/55.jpg", especialidades: ["Canal", "Historia", "Cultura"], disponible: true },
      { id: 7, name: "Isabella Romano", description: "Arquitecta e historiadora del arte especializada en Roma y el Vaticano. Tours en español por la Italia clásica.", languages: "Español, Italiano, Francés", location: "Roma", country: "italia", rank: "diamond", price: 50, photo: "https://randomuser.me/api/portraits/women/33.jpg", especialidades: ["Arte", "Arquitectura", "Historia"], disponible: true },
      { id: 8, name: "Hiroshi Tanaka", description: "Guía entre culturas con 15 años de experiencia llevando viajeros latinoamericanos por Japón.", languages: "Español, Japonés, Inglés", location: "Tokio", country: "japon", rank: "diamond", price: 50, photo: "https://randomuser.me/api/portraits/men/88.jpg", especialidades: ["Cultura", "Templos", "Gastronomía"], disponible: true }
    ];
    saveGuides();
  }
}

function saveGuides() {
  localStorage.setItem('kavariGuides', JSON.stringify(guides));
}

// ========== NAVIGATION ==========
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'tourist') {
    renderFilters();
    renderGuides();
  }
  if (name === 'guide') {
    selectedPaymentMethod = '';
    selectedRank = 'silver';
    updateRankUI();
    updateAmountDisplay();
    hideBankAndCardFields();
  }
}

function goHome() {
  showPage('home');
}

// ========== FILTERS & GUIDE LIST ==========
function renderFilters() {
  const bar = document.getElementById('filterBar');
  const options = [
    { key: 'all', label: 'Todos' },
    { key: 'diamond', label: 'Diamante' },
    { key: 'gold', label: 'Oro' },
    { key: 'silver', label: 'Plata' }
  ];
  bar.innerHTML = options.map(o =>
    `<div class="filter-chip ${currentFilter === o.key ? 'active' : ''}" onclick="setFilter('${o.key}')">${o.label}</div>`
  ).join('');
}

function setFilter(f) {
  currentFilter = f;
  renderFilters();
  renderGuides();
}

function sortGuides(list) {
  const order = { diamond: 0, gold: 1, silver: 2 };
  return [...list].sort((a, b) => order[a.rank] - order[b.rank]);
}

function renderGuides() {
  const container = document.getElementById('guidesContainer');
  let list = currentFilter === 'all' ? guides : guides.filter(g => g.rank === currentFilter);
  list = sortGuides(list);

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <p>No hay guías con este nivel por ahora.</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map(g => {
    const rankLabel = { diamond: 'Diamante', gold: 'Oro', silver: 'Plata' }[g.rank];
    return `
      <div class="guide-card rank-${g.rank}">
        <img class="guide-avatar" src="${g.photo || 'https://via.placeholder.com/72'}" onerror="this.src='https://via.placeholder.com/72?text=G'" alt="${g.name}">
        <div class="guide-info">
          <div class="guide-name-row">
            <span class="guide-name">${g.name}</span>
            <span class="rank-badge badge-${g.rank}">${rankLabel}</span>
          </div>
          <p class="guide-desc">${g.description}</p>
          <div class="guide-meta">
            <span>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
              ${g.languages}
            </span>
            <span>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              ${g.location}
            </span>
          </div>
        </div>
        <div class="guide-price-col">
          <div class="price-num">$${g.price}</div>
          <div class="price-unit">USD / hora</div>
          <button class="btn btn-primary btn-sm" style="margin-top:12px;" onclick="openContact(${g.id})">Contratar</button>
        </div>
      </div>`;
  }).join('');
}

// ========== CONTACT MODAL ==========
function openContact(id) {
  currentContactGuide = guides.find(g => g.id === id);
  if (!currentContactGuide) return;
  const rankLabel = { diamond: 'Diamante', gold: 'Oro', silver: 'Plata' }[currentContactGuide.rank];
  document.getElementById('modalGuideName').textContent = currentContactGuide.name;
  document.getElementById('modalGuideRank').textContent = rankLabel + ' — $' + currentContactGuide.price + ' USD/hora';
  document.getElementById('contactModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('contactModal').classList.add('hidden');
}

function submitContact() {
  const name = document.getElementById('clientName').value.trim();
  const email = document.getElementById('clientEmail').value.trim();
  const date = document.getElementById('tourDate').value;

  if (!name || !email || !date) {
    notify('error', 'Campos incompletos', 'Por favor completa tu nombre, correo y fecha del tour.');
    return;
  }

  closeModal();
  notify('success', 'Solicitud enviada', `Tu solicitud para contactar a ${currentContactGuide.name} fue enviada. Recibirás respuesta en tu correo pronto.`);
  document.getElementById('clientName').value = '';
  document.getElementById('clientEmail').value = '';
  document.getElementById('tourDate').value = '';
  document.getElementById('clientMsg').value = '';
}

// ========== PAYMENT UI ==========
function selectRank(rank) {
  selectedRank = rank;
  updateRankUI();
  updateAmountDisplay();
}

function updateRankUI() {
  document.querySelectorAll('.rank-option').forEach(el => {
    el.classList.remove('selected');
    if (el.getAttribute('data-rank') === selectedRank) el.classList.add('selected');
  });
}

function updateAmountDisplay() {
  document.getElementById('amountDisplay').textContent = '$' + rankPrices[selectedRank];
}

function selectPayment(method) {
  selectedPaymentMethod = method;
  document.querySelectorAll('.payment-method').forEach(el => {
    el.classList.remove('selected');
    if (el.getAttribute('data-method') === method) el.classList.add('selected');
  });
  hideBankAndCardFields();
  if (method === 'banco' || method === 'yappy') {
    document.getElementById('bankFields').classList.add('show');
  } else if (method === 'card') {
    document.getElementById('cardFields').classList.add('show');
  }
}

function hideBankAndCardFields() {
  document.getElementById('bankFields').classList.remove('show');
  document.getElementById('cardFields').classList.remove('show');
}

function formatAccount(el) {
  let val = el.value.replace(/\D/g, '');
  let parts = val.match(/.{1,4}/g) || [];
  el.value = parts.join('-').slice(0, 22);
}

function formatCard(el) {
  let val = el.value.replace(/\D/g, '');
  let parts = val.match(/.{1,4}/g) || [];
  el.value = parts.join(' ').slice(0, 19);
}

function formatExp(el) {
  let val = el.value.replace(/\D/g, '');
  if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
  el.value = val.slice(0, 5);
}

// ========== VALIDATION ==========
function validateField(fieldId, errId, condition, msg) {
  const input = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (!input || !err) return condition;
  if (!condition) {
    input.classList.add('error');
    err.classList.add('show');
    err.textContent = msg;
    return false;
  }
  input.classList.remove('error');
  err.classList.remove('show');
  return true;
}

function clearErrors() {
  document.querySelectorAll('.field input, .field select, .field textarea').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('show'));
}

// ========== REGISTRATION ==========
function submitGuideRegistration() {
  clearErrors();
  const firstName = (document.getElementById('firstName') || {}).value?.trim() || '';
  const lastName = (document.getElementById('lastName') || {}).value?.trim() || '';
  const name = firstName && lastName ? firstName + ' ' + lastName : (document.getElementById('fullName') || {}).value?.trim() || '';
  const bio = document.getElementById('bio').value.trim();
  const languages = document.getElementById('languages').value.trim();
  const location = document.getElementById('location').value.trim();
  const email = (document.getElementById('email') || {}).value?.trim() || '';
  const password = (document.getElementById('password') || {}).value?.trim() || '';
  const phone = (document.getElementById('phone') || {}).value?.trim() || '';
  const experience = (document.getElementById('experience') || {}).value || '';
  const specialties = (document.getElementById('specialties') || {}).value?.trim() || '';
  const countryEl = document.getElementById('guideCountrySelect');
  const country = countryEl ? countryEl.value : '';

  let valid = true;
  if (!name) { valid = false; validateField('firstName', 'err-firstName', false, 'El nombre es obligatorio.'); }
  if (!bio || bio.length < 20) { valid = false; validateField('bio', 'err-bio', false, 'Ingresa al menos 20 caracteres de descripción.'); }
  if (!languages) { valid = false; validateField('languages', 'err-languages', false, 'Indica los idiomas que hablas.'); }
  if (!location) { valid = false; validateField('location', 'err-location', false, 'Indica tu ciudad.'); }
  if (!country) { valid = false; const errC = document.getElementById('err-country'); if (errC) { errC.classList.add('show'); } }

  if (!valid) {
    notify('warning', 'Formulario incompleto', 'Hay campos requeridos que debes completar antes de continuar.');
    return;
  }

  if (!selectedPaymentMethod) {
    notify('error', 'Método de pago requerido', 'Selecciona cómo deseas realizar el pago para activar tu perfil.');
    return;
  }

  // Payment validation
  if (selectedPaymentMethod === 'banco' || selectedPaymentMethod === 'yappy') {
    const acct = document.getElementById('accountNum').value.trim();
    const holder = document.getElementById('accountHolder').value.trim();
    if (!acct || acct.replace(/\D/g, '').length < 8) {
      validateField('accountNum', 'err-accountNum', false, 'Ingresa un número de cuenta válido (mínimo 8 dígitos).');
      notify('error', 'Datos bancarios incompletos', 'Verifica el número de cuenta ingresado.');
      return;
    }
    if (!holder) {
      validateField('accountHolder', 'err-accountHolder', false, 'El nombre del titular es obligatorio.');
      notify('error', 'Datos bancarios incompletos', 'Ingresa el nombre del titular de la cuenta.');
      return;
    }
  }

  if (selectedPaymentMethod === 'card') {
    const cardNum = document.getElementById('cardNum').value.replace(/\s/g, '');
    if (cardNum.length < 16) {
      validateField('cardNum', 'err-cardNum', false, 'El número de tarjeta debe tener 16 dígitos.');
      notify('error', 'Datos de tarjeta incompletos', 'Verifica el número de tarjeta ingresado.');
      return;
    }
  }

  // Process
  const price = rankPrices[selectedRank];
  const photoFile = document.getElementById('photoFile').files[0];

  function finalize(photoSrc) {
    const especialidadesArr = specialties ? specialties.split(',').map(s => s.trim()).filter(Boolean) : [];
    const newGuide = {
      id: Date.now(),
      name, description: bio, languages, location, country,
      email, phone, experience,
      rank: selectedRank,
      price: rankHourlyRates[selectedRank],
      photo: photoSrc || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0050a0&color=fff`,
      especialidades: especialidadesArr,
      disponible: true
    };
    guides.push(newGuide);
    saveGuides();

    notify('success', 'Pago procesado exitosamente', `Se realizó el cargo de $${price} USD. Tu perfil como guía ${selectedRank.toUpperCase()} en ${country} ya está activo.`);

    // Reset form
    ['firstName','lastName','email','password','phone','bio','languages','location','experience','specialties'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    if (document.getElementById('photoFile')) document.getElementById('photoFile').value = '';
    if (countryEl) countryEl.selectedIndex = 0;
    selectedPaymentMethod = '';
    selectedRank = 'silver';
    updateRankUI();
    updateAmountDisplay();
    hideBankAndCardFields();
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));

    setTimeout(() => {
      showPage('tourist');
      setFilter('all');
    }, 2000);
  }

  if (photoFile) {
    const reader = new FileReader();
    reader.onload = e => finalize(e.target.result);
    reader.readAsDataURL(photoFile);
  } else {
    finalize(null);
  }
}

// ========== FILTER BY COUNTRY (para destino.js) ==========
function getGuidesByCountry(countryCode) {
  return guides.filter(g => g.country === countryCode || !g.country);
}

// ========== NOTIFICATION SYSTEM ==========
let notifCounter = 0;

function notify(type, title, message, duration = 5000) {
  const stack = document.getElementById('notification-stack');
  const id = 'notif-' + (++notifCounter);

  const icons = {
    success: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    error: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    warning: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
    info: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
  };

  const el = document.createElement('div');
  el.className = 'notification';
  el.id = id;
  el.innerHTML = `
    <div class="notif-bar ${type}"></div>
    <div class="notif-body">
      <div class="notif-icon ${type}">${icons[type]}</div>
      <div class="notif-content">
        <div class="notif-title">${title}</div>
        <div class="notif-msg">${message}</div>
      </div>
      <button class="notif-close" onclick="dismissNotif('${id}')">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="notif-progress">
      <div class="notif-progress-bar ${type}" id="pb-${id}" style="width:100%"></div>
    </div>
  `;

  stack.appendChild(el);

  // Animate progress bar
  const pb = document.getElementById('pb-' + id);
  requestAnimationFrame(() => {
    pb.style.transition = `width ${duration}ms linear`;
    pb.style.width = '0%';
  });

  setTimeout(() => dismissNotif(id), duration);
}

function dismissNotif(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('removing');
  setTimeout(() => el.remove(), 250);
}

// ========== CLOSE MODAL ON BACKDROP ==========
document.getElementById('contactModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ========== START ==========
init();

