/* ============================================
   CONTACTO.JS — KAVARI Travel
   Navbar al hacer scroll, menú hamburguesa (móvil),
   animación de entrada escalonada (.reveal) y
   feedback táctil en las tarjetas del equipo.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar: fondo sólido al hacer scroll ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Menú hamburguesa (móvil) ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks && navbar) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      const clickedInsideNav = navbar.contains(e.target);
      if (!clickedInsideNav && navLinks.classList.contains('open')) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  /* ---------- Animación de entrada (.reveal) con efecto escalonado ---------- */
  const revealEls = Array.from(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window && revealEls.length) {
    const groups = new Map();
    revealEls.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = groups.get(el.parentElement) || [el];
        const index = siblings.indexOf(el);
        const delay = Math.min(index, 6) * 90;

        setTimeout(() => el.classList.add('visible'), delay);
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Feedback táctil en tarjetas de correo del equipo (móvil) ---------- */
  const tapTargets = Array.from(document.querySelectorAll('.email-team-item, .ig-item'));
  tapTargets.forEach((el) => {
    let tapTimeout;
    el.addEventListener('touchstart', () => {
      el.classList.add('tapped');
      clearTimeout(tapTimeout);
      tapTimeout = setTimeout(() => el.classList.remove('tapped'), 1200);
    }, { passive: true });
  });

});