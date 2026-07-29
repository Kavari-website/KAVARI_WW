/**
 * tutorial.js — Tutorial interactivo KAVARI con soporte multilingüe
 */

// Detectar página actual
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ===== PASOS PARA INDEX =====
const tutorialStepsIndex = [
  { targetId: null, titleKey: 'tutorialIndexTitulo_0', descKey: 'tutorialIndexDesc_0', position: 'center', arrow: false },
  { targetId: 'navbar', titleKey: 'tutorialIndexTitulo_1', descKey: 'tutorialIndexDesc_1', position: 'bottom', arrow: true },
  { targetSelector: '.nav-links a[href="guias.html"]', titleKey: 'tutorialIndexTitulo_2', descKey: 'tutorialIndexDesc_2', position: 'bottom', arrow: true },
  { targetId: 'btnTutorial', titleKey: 'tutorialIndexTitulo_3', descKey: 'tutorialIndexDesc_3', position: 'bottom', arrow: true },
  { targetId: 'btnLang', titleKey: 'tutorialIndexTitulo_4', descKey: 'tutorialIndexDesc_4', position: 'bottom', arrow: true },
  { targetId: 'btnTheme', titleKey: 'tutorialIndexTitulo_5', descKey: 'tutorialIndexDesc_5', position: 'bottom', arrow: true },
  { targetSelector: '.search-box', titleKey: 'tutorialIndexTitulo_6', descKey: 'tutorialIndexDesc_6', position: 'top', arrow: true },
  { targetSelector: '.featured-section', titleKey: 'tutorialIndexTitulo_7', descKey: 'tutorialIndexDesc_7', position: 'top', arrow: true },
  { targetSelector: '.places-section', titleKey: 'tutorialIndexTitulo_8', descKey: 'tutorialIndexDesc_8', position: 'top', arrow: true },
  { targetSelector: '.footer', titleKey: 'tutorialIndexTitulo_9', descKey: 'tutorialIndexDesc_9', position: 'top', arrow: true },
  { targetId: 'kavari-chat-btn', titleKey: 'tutorialIndexTitulo_10', descKey: 'tutorialIndexDesc_10', position: 'center', arrow: true },
  { targetId: null, titleKey: 'tutorialIndexTitulo_11', descKey: 'tutorialIndexDesc_11', position: 'center', arrow: false, isLast: true }
];

// ===== PASOS PARA PAÍSES =====
const tutorialStepsPaises = [
  { targetId: null, titleKey: 'tutorialPaisesTitulo_0', descKey: 'tutorialPaisesDesc_0', position: 'center', arrow: false },
  { targetId: 'btnTutorial', titleKey: 'tutorialPaisesTitulo_1', descKey: 'tutorialPaisesDesc_1', position: 'bottom', arrow: true },
  { targetId: 'btnLang', titleKey: 'tutorialPaisesTitulo_2', descKey: 'tutorialPaisesDesc_2', position: 'bottom', arrow: true },
  { targetId: 'btnTheme', titleKey: 'tutorialPaisesTitulo_3', descKey: 'tutorialPaisesDesc_3', position: 'bottom', arrow: true },
  { targetSelector: '.search-wrap', titleKey: 'tutorialPaisesTitulo_4', descKey: 'tutorialPaisesDesc_4', position: 'bottom', arrow: true },
  { targetSelector: '.stat-pill', titleKey: 'tutorialPaisesTitulo_5', descKey: 'tutorialPaisesDesc_5', position: 'bottom', arrow: true },
  { targetSelector: '.dest-card', titleKey: 'tutorialPaisesTitulo_6', descKey: 'tutorialPaisesDesc_6', position: 'center', arrow: true },
  { targetSelector: '.dest-info', titleKey: 'tutorialPaisesTitulo_7', descKey: 'tutorialPaisesDesc_7', position: 'center', arrow: true },
  { targetSelector: '.dest-btn', titleKey: 'tutorialPaisesTitulo_8', descKey: 'tutorialPaisesDesc_8', position: 'center', arrow: true },
  { targetSelector: '.region-label', titleKey: 'tutorialPaisesTitulo_9', descKey: 'tutorialPaisesDesc_9', position: 'bottom', arrow: true },
  { targetId: 'kavari-chat-btn', titleKey: 'tutorialPaisesTitulo_10', descKey: 'tutorialPaisesDesc_10', position: 'center', arrow: true },
  { targetId: null, titleKey: 'tutorialPaisesTitulo_11', descKey: 'tutorialPaisesDesc_11', position: 'center', arrow: false, isLast: true }
];

// ===== PASOS PARA SOBRE NOSOTROS =====
const tutorialStepsSobrenosotros = [
  { targetId: null, titleKey: 'tutorialSobrenosotrosTitulo_0', descKey: 'tutorialSobrenosotrosDesc_0', position: 'center', arrow: false },
  { targetId: 'navbar', titleKey: 'tutorialSobrenosotrosTitulo_1', descKey: 'tutorialSobrenosotrosDesc_1', position: 'bottom', arrow: true },
  { targetId: 'btnTutorial', titleKey: 'tutorialSobrenosotrosTitulo_2', descKey: 'tutorialSobrenosotrosDesc_2', position: 'bottom', arrow: true },
  { targetId: 'btnLang', titleKey: 'tutorialSobrenosotrosTitulo_3', descKey: 'tutorialSobrenosotrosDesc_3', position: 'bottom', arrow: true },
  { targetId: 'btnTheme', titleKey: 'tutorialSobrenosotrosTitulo_4', descKey: 'tutorialSobrenosotrosDesc_4', position: 'bottom', arrow: true },
  { targetSelector: '.about-intro', titleKey: 'tutorialSobrenosotrosTitulo_5', descKey: 'tutorialSobrenosotrosDesc_5', position: 'bottom', arrow: true },
  { targetSelector: '.mv-section', titleKey: 'tutorialSobrenosotrosTitulo_6', descKey: 'tutorialSobrenosotrosDesc_6', position: 'top', arrow: true },
  { targetSelector: '.member-card', titleKey: 'tutorialSobrenosotrosTitulo_7', descKey: 'tutorialSobrenosotrosDesc_7', position: 'center', arrow: true },
  { targetSelector: '.member-card.leader', titleKey: 'tutorialSobrenosotrosTitulo_8', descKey: 'tutorialSobrenosotrosDesc_8', position: 'bottom', arrow: true },
  { targetSelector: '.footer', titleKey: 'tutorialSobrenosotrosTitulo_9', descKey: 'tutorialSobrenosotrosDesc_9', position: 'top', arrow: true },
  { targetId: 'kavari-chat-btn', titleKey: 'tutorialSobrenosotrosTitulo_10', descKey: 'tutorialSobrenosotrosDesc_10', position: 'center', arrow: true },
  { targetId: null, titleKey: 'tutorialSobrenosotrosTitulo_11', descKey: 'tutorialSobrenosotrosDesc_11', position: 'center', arrow: false, isLast: true }
];

// ===== PASOS PARA AYUDA =====
const tutorialStepsAyuda = [
  { targetId: null, titleKey: 'tutorialAyudaTitulo_0', descKey: 'tutorialAyudaDesc_0', position: 'center', arrow: false },
  { targetId: 'navbar', titleKey: 'tutorialAyudaTitulo_1', descKey: 'tutorialAyudaDesc_1', position: 'bottom', arrow: true },
  { targetId: 'btnTutorial', titleKey: 'tutorialAyudaTitulo_2', descKey: 'tutorialAyudaDesc_2', position: 'bottom', arrow: true },
  { targetId: 'btnLang', titleKey: 'tutorialAyudaTitulo_3', descKey: 'tutorialAyudaDesc_3', position: 'bottom', arrow: true },
  { targetId: 'btnTheme', titleKey: 'tutorialAyudaTitulo_4', descKey: 'tutorialAyudaDesc_4', position: 'bottom', arrow: true },
  { targetSelector: '.help-search', titleKey: 'tutorialAyudaTitulo_5', descKey: 'tutorialAyudaDesc_5', position: 'bottom', arrow: true },
  { targetSelector: '.help-categories', titleKey: 'tutorialAyudaTitulo_6', descKey: 'tutorialAyudaDesc_6', position: 'top', arrow: true },
  { targetSelector: '.faq-section', titleKey: 'tutorialAyudaTitulo_7', descKey: 'tutorialAyudaDesc_7', position: 'top', arrow: true },
  { targetSelector: '.faq-item', titleKey: 'tutorialAyudaTitulo_8', descKey: 'tutorialAyudaDesc_8', position: 'center', arrow: true },
  { targetSelector: '.help-cta', titleKey: 'tutorialAyudaTitulo_9', descKey: 'tutorialAyudaDesc_9', position: 'top', arrow: true },
  { targetId: 'kavari-chat-btn', titleKey: 'tutorialAyudaTitulo_10', descKey: 'tutorialAyudaDesc_10', position: 'center', arrow: true },
  { targetId: null, titleKey: 'tutorialAyudaTitulo_11', descKey: 'tutorialAyudaDesc_11', position: 'center', arrow: false, isLast: true }
];

// ===== PASOS PARA CONTACTO =====
const tutorialStepsContacto = [
  { targetId: null, titleKey: 'tutorialContactoTitulo_0', descKey: 'tutorialContactoDesc_0', position: 'center', arrow: false },
  { targetId: 'navbar', titleKey: 'tutorialContactoTitulo_1', descKey: 'tutorialContactoDesc_1', position: 'bottom', arrow: true },
  { targetId: 'btnTutorial', titleKey: 'tutorialContactoTitulo_2', descKey: 'tutorialContactoDesc_2', position: 'bottom', arrow: true },
  { targetId: 'btnLang', titleKey: 'tutorialContactoTitulo_3', descKey: 'tutorialContactoDesc_3', position: 'bottom', arrow: true },
  { targetId: 'btnTheme', titleKey: 'tutorialContactoTitulo_4', descKey: 'tutorialContactoDesc_4', position: 'bottom', arrow: true },
  { targetSelector: '.contact-float', titleKey: 'tutorialContactoTitulo_5', descKey: 'tutorialContactoDesc_5', position: 'bottom', arrow: true },
  { targetSelector: '.contact-ig', titleKey: 'tutorialContactoTitulo_6', descKey: 'tutorialContactoDesc_6', position: 'center', arrow: true },
  { targetSelector: '#seccion-superarte', titleKey: 'tutorialContactoTitulo_7', descKey: 'tutorialContactoDesc_7', position: 'top', arrow: true },
  { targetSelector: '#seccion-correos', titleKey: 'tutorialContactoTitulo_8', descKey: 'tutorialContactoDesc_8', position: 'top', arrow: true },
  { targetSelector: '.back-btn-wrap', titleKey: 'tutorialContactoTitulo_9', descKey: 'tutorialContactoDesc_9', position: 'top', arrow: true },
  { targetId: 'kavari-chat-btn', titleKey: 'tutorialContactoTitulo_10', descKey: 'tutorialContactoDesc_10', position: 'center', arrow: true },
  { targetId: null, titleKey: 'tutorialContactoTitulo_11', descKey: 'tutorialContactoDesc_11', position: 'center', arrow: false, isLast: true }
];

const tutorialStepsDestino = [
  { targetId: null, titleKey: 'tutorialDestinoTitulo_0', descKey: 'tutorialDestinoDesc_0', position: 'center', arrow: false },
  { targetId: 'navbar', titleKey: 'tutorialDestinoTitulo_1', descKey: 'tutorialDestinoDesc_1', position: 'bottom', arrow: true },
  { targetId: 'navLinks', titleKey: 'tutorialDestinoTitulo_2', descKey: 'tutorialDestinoDesc_2', position: 'bottom', arrow: true },
  { targetId: 'countrySwitcher', titleKey: 'tutorialDestinoTitulo_3', descKey: 'tutorialDestinoDesc_3', position: 'bottom', arrow: true },
  { targetId: 'btnTutorial', titleKey: 'tutorialDestinoTitulo_4', descKey: 'tutorialDestinoDesc_4', position: 'bottom', arrow: true },
  { targetId: 'btnLang', titleKey: 'tutorialDestinoTitulo_5', descKey: 'tutorialDestinoDesc_5', position: 'bottom', arrow: true },
  { targetId: 'btnTheme', titleKey: 'tutorialDestinoTitulo_6', descKey: 'tutorialDestinoDesc_6', position: 'bottom', arrow: true },
  { targetSelector: '.hero-content', titleKey: 'tutorialDestinoTitulo_7', descKey: 'tutorialDestinoDesc_7', position: 'top', arrow: true },
  { targetId: 'destinosInicio', titleKey: 'tutorialDestinoTitulo_8', descKey: 'tutorialDestinoDesc_8', position: 'top', arrow: true },
  { targetSelector: 'a[data-sec="cultura"]', titleKey: 'tutorialDestinoTitulo_9', descKey: 'tutorialDestinoDesc_9', position: 'bottom', arrow: true },
  { targetSelector: 'a[data-sec="lugares"]', titleKey: 'tutorialDestinoTitulo_10', descKey: 'tutorialDestinoDesc_10', position: 'bottom', arrow: true },
  { targetSelector: 'a[data-sec="gastronomia"]', titleKey: 'tutorialDestinoTitulo_11', descKey: 'tutorialDestinoDesc_11', position: 'bottom', arrow: true },
  { targetSelector: 'a[data-sec="aventura"]', titleKey: 'tutorialDestinoTitulo_12', descKey: 'tutorialDestinoDesc_12', position: 'bottom', arrow: true },
  { targetSelector: 'a[data-sec="practica"]', titleKey: 'tutorialDestinoTitulo_13', descKey: 'tutorialDestinoDesc_13', position: 'bottom', arrow: true },
  { targetSelector: 'a[data-sec="aerolineas"]', titleKey: 'tutorialDestinoTitulo_14', descKey: 'tutorialDestinoDesc_14', position: 'bottom', arrow: true },
  { targetSelector: 'a[data-sec="hospedajes"]', titleKey: 'tutorialDestinoTitulo_15', descKey: 'tutorialDestinoDesc_15', position: 'bottom', arrow: true },
  { targetSelector: 'a[data-sec="souvenires"]', titleKey: 'tutorialDestinoTitulo_16', descKey: 'tutorialDestinoDesc_16', position: 'bottom', arrow: true },
  { targetSelector: 'a[data-sec="guias"]', titleKey: 'tutorialDestinoTitulo_17', descKey: 'tutorialDestinoDesc_17', position: 'bottom', arrow: true },
  { targetId: 'kavari-chat-btn', titleKey: 'tutorialDestinoTitulo_18', descKey: 'tutorialDestinoDesc_18', position: 'center', arrow: true },
  { targetId: null, titleKey: 'tutorialDestinoTitulo_19', descKey: 'tutorialDestinoDesc_19', position: 'center', arrow: false, isLast: true }
];

const tutorialStepsGeneral = [
  { title: 'Bienvenido a KAVARI', desc: 'Este recorrido te muestra los controles principales de esta página.', position: 'center', arrow: false },
  { targetSelector: '.portal-nav, .topbar, .page-destino .navbar', title: 'Navegación', desc: 'Aquí encuentras las opciones para moverte por KAVARI y ajustar tu experiencia.', position: 'bottom', arrow: true },
  { targetSelector: '.pricing-grid, .auth-shell, .hero-actions', title: 'Contenido principal', desc: 'Explora esta sección paso a paso. El tutorial resaltará solo la zona relevante.', position: 'top', arrow: true },
  { targetId: 'kavari-chat-btn', title: 'Asistente KAVARI', desc: 'Abre el asistente cuando necesites ayuda durante tu recorrido.', position: 'center', arrow: true, isLast: true }
];

// ===== SELECCIÓN DE PASOS SEGÚN PÁGINA =====
let tutorialSteps = tutorialStepsIndex;
if (currentPage === 'paises.html') {
  tutorialSteps = tutorialStepsPaises;
} else if (currentPage === 'sobrenosotros.html' || currentPage === 'sobre-nosotros.html') {
  tutorialSteps = tutorialStepsSobrenosotros;
} else if (currentPage === 'ayuda.html') {
  tutorialSteps = tutorialStepsAyuda;
} else if (currentPage === 'contacto.html') {
  tutorialSteps = tutorialStepsContacto;
} else if (currentPage === 'destino.html') {
  tutorialSteps = tutorialStepsDestino;
} else if (['guias.html', 'planes.html', 'cuenta.html'].includes(currentPage)) {
  tutorialSteps = tutorialStepsGeneral;
}

let tutorialCurrentStep = 0;
let tutorialActive = false;

// ------------------ Funciones principales ------------------
function startTutorial(force = false) {
  let tutorialKey = 'kavariTutorialVisto';
  if (currentPage === 'paises.html') tutorialKey = 'kavariTutorialPaisesVisto';
  else if (currentPage === 'sobrenosotros.html' || currentPage === 'sobre-nosotros.html') tutorialKey = 'kavariTutorialSobrenosotrosVisto';
  else if (currentPage === 'ayuda.html') tutorialKey = 'kavariTutorialAyudaVisto';
  else if (currentPage === 'contacto.html') tutorialKey = 'kavariTutorialContactoVisto';
  else if (currentPage === 'destino.html') tutorialKey = 'kavariTutorialDestinoVisto';

  const visto = localStorage.getItem(tutorialKey);
  if (visto && !force) return;
  tutorialActive = true;
  tutorialCurrentStep = 0;
  createTutorialOverlay();
  showTutorialStep(0);
}

function createTutorialOverlay() {
  const existing = document.getElementById('kavariTutorialOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'kavariTutorialOverlay';
  overlay.innerHTML = `
    <div class="tut-backdrop" id="tutBackdrop"></div>
    <div class="tut-highlight" id="tutHighlight"></div>
    <div class="tut-tooltip" id="tutTooltip">
      <div class="tut-tooltip-arrow" id="tutArrow"></div>
      <div class="tut-progress" id="tutProgress">
        ${tutorialSteps.map((_, i) => `<div class="tut-dot" id="tutDot${i}"></div>`).join('')}
      </div>
      <div class="tut-step-num" id="tutStepNum"></div>
      <h3 class="tut-title" id="tutTitle"></h3>
      <p class="tut-desc" id="tutDesc"></p>
      <div class="tut-actions">
        <button class="tut-btn-skip" onclick="skipTutorial()" id="tutSkipBtn"></button>
        <div class="tut-nav-btns">
          <button class="tut-btn-prev" onclick="prevTutorialStep()" id="tutPrevBtn"></button>
          <button class="tut-btn-next" onclick="nextTutorialStep()" id="tutNextBtn"></button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  updateTutorialTexts();
}

function updateTutorialTexts() {
  const skipBtn = document.getElementById('tutSkipBtn');
  const prevBtn = document.getElementById('tutPrevBtn');
  const nextBtn = document.getElementById('tutNextBtn');
  if (skipBtn) skipBtn.textContent = t('tutorialSaltar');
  if (prevBtn) prevBtn.textContent = t('tutorialAnterior');
  if (nextBtn) nextBtn.textContent = t('tutorialSiguiente');

  if (tutorialActive) {
    showTutorialStep(tutorialCurrentStep);
  }
}

function showTutorialStep(index) {
  const step = tutorialSteps[index];
  if (!step) { endTutorial(); return; }

  const title = step.title || t(step.titleKey);
  const desc = step.desc || t(step.descKey);
  const stepNumText = t('tutorialPasoDe')
    .replace('{current}', index + 1)
    .replace('{total}', tutorialSteps.length);

  document.getElementById('tutTitle').textContent = title;
  document.getElementById('tutDesc').textContent = desc;
  document.getElementById('tutStepNum').textContent = stepNumText;

  const prevBtn = document.getElementById('tutPrevBtn');
  const nextBtn = document.getElementById('tutNextBtn');
  const skipBtn = document.getElementById('tutSkipBtn');
  prevBtn.style.display = index === 0 ? 'none' : '';
  nextBtn.textContent = step.isLast ? t('tutorialComenzar') : t('tutorialSiguiente');
  skipBtn.style.display = step.isLast ? 'none' : '';

  document.querySelectorAll('.tut-dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
    d.classList.toggle('done', i < index);
  });

  tutorialCurrentStep = index;
  refreshTutorialHighlight(step);
}

// ------------------ Funciones auxiliares ------------------
function getTutorialTarget(step) {
  if (step.targetId) return document.getElementById(step.targetId);
  if (step.targetSelector) return document.querySelector(step.targetSelector);
  return null;
}

function refreshTutorialHighlight(step, skipScroll = false) {
  const targetEl = getTutorialTarget(step);
  positionTooltip(step, targetEl);
  highlightElement(targetEl);

  if (targetEl && !skipScroll) {
    setTimeout(() => {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}

window.addEventListener('scroll', () => {
  if (!tutorialActive) return;
  const step = tutorialSteps[tutorialCurrentStep];
  if (step) refreshTutorialHighlight(step, true);
}, { passive: true });

// ===== NUEVA FUNCIÓN positionTooltip (sin tapar el elemento) =====
function positionTooltip(step, targetEl) {
  const tooltip = document.getElementById('tutTooltip');
  const arrow = document.getElementById('tutArrow');
  arrow.style.display = step.arrow && targetEl ? '' : 'none';

  if (!targetEl || step.position === 'center') {
    tooltip.style.cssText = `
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: min(480px, 90vw);
    `;
    return;
  }

  const rect = targetEl.getBoundingClientRect();
  const tooltipW = Math.min(380, window.innerWidth * 0.85);
  const tooltipH = 280;
  const margin = 20;

  const spaceTop = rect.top;
  const spaceBottom = window.innerHeight - rect.bottom;
  const spaceLeft = rect.left;
  const spaceRight = window.innerWidth - rect.right;

  let top, left, posClass;

  // Elegir la mejor posición
  if (spaceBottom >= spaceTop && spaceBottom >= tooltipH + margin) {
    top = rect.bottom + margin;
    posClass = 'arrow-top';
    left = Math.max(margin, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - margin));
  } else if (spaceTop >= spaceBottom && spaceTop >= tooltipH + margin) {
    top = rect.top - tooltipH - margin;
    posClass = 'arrow-bottom';
    left = Math.max(margin, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - margin));
  } else if (spaceRight >= spaceLeft && spaceRight >= tooltipW + margin) {
    top = Math.max(margin, Math.min(rect.top + rect.height / 2 - tooltipH / 2, window.innerHeight - tooltipH - margin));
    left = rect.right + margin;
    posClass = 'arrow-left';
  } else if (spaceLeft >= spaceRight && spaceLeft >= tooltipW + margin) {
    top = Math.max(margin, Math.min(rect.top + rect.height / 2 - tooltipH / 2, window.innerHeight - tooltipH - margin));
    left = rect.left - tooltipW - margin;
    posClass = 'arrow-right';
  } else {
    // Fallback: centrar en pantalla
    tooltip.style.cssText = `
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: min(480px, 90vw);
    `;
    arrow.style.display = 'none';
    return;
  }

  // Ajustar límites
  left = Math.max(margin, Math.min(left, window.innerWidth - tooltipW - margin));
  top = Math.max(margin, Math.min(top, window.innerHeight - tooltipH - margin));

  tooltip.style.cssText = `
    position: fixed;
    top: ${top}px;
    left: ${left}px;
    width: ${tooltipW}px;
    transform: none;
  `;

  if (posClass) {
    arrow.className = 'tut-tooltip-arrow ' + posClass;
    arrow.style.display = '';
  } else {
    arrow.style.display = 'none';
  }
}

function highlightElement(el) {
  const highlight = document.getElementById('tutHighlight');
  if (!el) {
    highlight.style.display = 'none';
    return;
  }
  const rect = el.getBoundingClientRect();
  highlight.style.cssText = `
    display: block;
    position: fixed;
    top: ${rect.top - 6}px;
    left: ${rect.left - 6}px;
    width: ${rect.width + 12}px;
    height: ${rect.height + 12}px;
    border-radius: 10px;
    box-shadow: 0 0 0 9999px rgba(0,0,0,0.55), 0 0 0 3px #00c2a8, 0 0 20px rgba(0,194,168,0.5);
    pointer-events: none;
    transition: all 0.4s cubic-bezier(0.4,0,0.2,1);will-change:transform,box-shadow;
    z-index: 10001;
  `;
}

// ------------------ Navegación del tutorial ------------------
function nextTutorialStep() {
  tutorialCurrentStep++;
  if (tutorialCurrentStep >= tutorialSteps.length) endTutorial();
  else showTutorialStep(tutorialCurrentStep);
}

function prevTutorialStep() {
  if (tutorialCurrentStep > 0) {
    tutorialCurrentStep--;
    showTutorialStep(tutorialCurrentStep);
  }
}

function skipTutorial() { endTutorial(); }

function endTutorial() {
  tutorialActive = false;
  let tutorialKey = 'kavariTutorialVisto';
  if (currentPage === 'paises.html') tutorialKey = 'kavariTutorialPaisesVisto';
  else if (currentPage === 'sobrenosotros.html' || currentPage === 'sobre-nosotros.html') tutorialKey = 'kavariTutorialSobrenosotrosVisto';
  else if (currentPage === 'ayuda.html') tutorialKey = 'kavariTutorialAyudaVisto';
  else if (currentPage === 'contacto.html') tutorialKey = 'kavariTutorialContactoVisto';
  localStorage.setItem(tutorialKey, '1');
  const overlay = document.getElementById('kavariTutorialOverlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 300);
  }
}

// ------------------ Escuchar cambios de idioma ------------------
window.addEventListener('kavari:langchange', updateTutorialTexts);

// ------------------ Inicialización automática ------------------
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => startTutorial(false), 1200);
});
