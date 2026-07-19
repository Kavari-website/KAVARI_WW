/* ============================================
   SOBRENOSOTROS.JS — KAVARI Travel
   Navbar al hacer scroll, menú móvil, animaciones
   de entrada (.reveal), contador de estadísticas
   y tilt 3D en las tarjetas de Misión/Visión.
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
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Contador animado para la franja de estadísticas ---------- */
  const statEls = Array.from(document.querySelectorAll('.about-stat-num[data-count]'));

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString('es-PA');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('es-PA');
      }
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && statEls.length) {
    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    statEls.forEach((el) => statsObserver.observe(el));
  } else {
    statEls.forEach((el) => {
      el.textContent = (parseInt(el.getAttribute('data-count'), 10) || 0).toLocaleString('es-PA');
    });
  }

  /* ---------- Feedback táctil en la franja de estadísticas ---------- */
  const statCards = Array.from(document.querySelectorAll('.about-stat'));
  statCards.forEach((stat) => {
    let tapTimeout;
    stat.addEventListener('touchstart', () => {
      statCards.forEach((s) => s.classList.remove('tapped'));
      stat.classList.add('tapped');
      clearTimeout(tapTimeout);
      tapTimeout = setTimeout(() => stat.classList.remove('tapped'), 1400);
    }, { passive: true });
  });

  /* ---------- Tilt 3D en tarjetas de Misión/Visión ---------- */
  const tiltCards = Array.from(document.querySelectorAll('.tilt-card'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (!prefersReducedMotion && !isCoarsePointer && tiltCards.length) {
    tiltCards.forEach((card) => {
      const maxTilt = 7; // grados

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;  // 0..1
        const y = (e.clientY - rect.top) / rect.height;  // 0..1
        const rotY = (x - 0.5) * (maxTilt * 2);
        const rotX = (0.5 - y) * (maxTilt * 2);
        card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

});