/**
 * theme.js — Sistema de modo oscuro y selector de idioma global KAVARI
 * Cargado en <head> para aplicar el tema ANTES de renderizar el DOM (sin parpadeo)
 */

(function applyThemeImmediately() {
  const saved = localStorage.getItem('kavariTheme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

function getThemeLabel(theme) {
  const lang = localStorage.getItem('kavariIdioma') || localStorage.getItem('idioma') || 'es';
  if (typeof textos !== 'undefined' && textos[lang]) {
    return theme === 'dark' ? textos[lang].modoClaro : textos[lang].modoOscuro;
  }
  return theme === 'dark' ? 'Claro' : 'Oscuro';
}

function updateThemeButton(theme) {
  const current = theme || document.documentElement.getAttribute('data-theme') || 'light';
  const btn = document.getElementById('btnTheme');
  if (!btn) return;
  const label = getThemeLabel(current);
  btn.textContent = label;
  const lang = localStorage.getItem('kavariIdioma') || 'es';
  btn.setAttribute('aria-label', current === 'dark'
    ? (lang === 'en' ? 'Switch to light mode' : 'Activar modo claro')
    : (lang === 'en' ? 'Switch to dark mode' : 'Activar modo oscuro'));
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('kavariTheme', theme);
  updateThemeButton(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}


document.addEventListener('DOMContentLoaded', function() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeButton(currentTheme);

  let savedLang = 'es';
  try {
    savedLang = localStorage.getItem('kavariIdioma') || localStorage.getItem('idioma') || 'es';
  } catch (e) {
    if (window.sessionStorage) savedLang = sessionStorage.getItem('kavariIdioma') || 'es';
  }

  if (typeof cambiarIdioma === 'function') {
    cambiarIdioma(savedLang);
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('kavariTheme')) applyTheme(e.matches ? 'dark' : 'light');
    });
  }
});

window.addEventListener('kavari:langchange', function() {
  updateThemeButton();
});

