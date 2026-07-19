/* ============================================
   AYUDA.JS — KAVARI Travel
   Navbar al hacer scroll, menú móvil, acordeón
   de preguntas frecuentes y buscador en vivo.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar: fondo sólido al hacer scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú hamburguesa (móvil) ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Cierra el menú al elegir una opción
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    // Cierra el menú si se hace clic fuera de él
    document.addEventListener('click', (e) => {
      const clickedInsideNav = navbar.contains(e.target);
      if (!clickedInsideNav && navLinks.classList.contains('open')) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  /* ---------- Acordeón de preguntas frecuentes ---------- */
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Cierra las demás preguntas de la misma sección para mantener orden visual
      const section = item.closest('.faq-section');
      if (section) {
        section.querySelectorAll('.faq-item.open').forEach((openItem) => {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          }
        });
      }

      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------- Scroll suave al hacer clic en una categoría ---------- */
  document.querySelectorAll('.help-cat-card[href^="#"]').forEach((card) => {
    card.addEventListener('click', (e) => {
      const targetId = card.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 100; // deja espacio para la navbar fija
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});

/* ---------- Buscador en vivo del centro de ayuda ---------- */
function filtrarFAQ() {
  const input = document.getElementById('helpSearch');
  const noResults = document.getElementById('noResultsFAQ');
  if (!input) return;

  const term = input.value.trim().toLowerCase();
  const sections = document.querySelectorAll('.faq-section');
  let totalVisible = 0;

  sections.forEach((section) => {
    let visibleInSection = 0;

    section.querySelectorAll('.faq-item').forEach((item) => {
      const questionText = item.querySelector('.faq-question span')?.textContent.toLowerCase() || '';
      const answerText = item.querySelector('.faq-answer-inner')?.textContent.toLowerCase() || '';
      const matches = term === '' || questionText.includes(term) || answerText.includes(term);

      item.style.display = matches ? '' : 'none';

      // Si una pregunta deja de coincidir, ciérrala para no dejar acordeones abiertos ocultos
      if (!matches && item.classList.contains('open')) {
        item.classList.remove('open');
        item.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      }

      if (matches) visibleInSection++;
    });

    section.style.display = visibleInSection > 0 ? '' : 'none';
    totalVisible += visibleInSection;
  });

  if (noResults) {
    noResults.style.display = totalVisible === 0 ? '' : 'none';
  }
}