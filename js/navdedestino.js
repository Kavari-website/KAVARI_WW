/* ════════════════════════════════════════════════════════════
   nav-enhance.js
   Capa adicional y no-destructiva sobre destino.js:
   - Indicador deslizante (pill) para el nav activo
   - Drawer móvil en vidrio con animaciones tipo iOS
   - Selector de país: reemplaza visualmente el <select> nativo
     por un botón + panel glass, mantenimiendo el <select> oculto
     como única fuente de verdad (para no tocar la lógica existente
     de cambiarPais() / destino.js).
════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ───────────── 1. Navbar: sombra/blur al hacer scroll ───────────── */
  var navbar = document.getElementById("navbar");
  function onScrollNav() {
    if (!navbar) return;
    if (window.scrollY > 12) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ───────────── 2. Pill deslizante que sigue al link activo ───────────── */
  var navLinksEl = document.getElementById("navLinks");
  var pill = document.getElementById("navPillIndicator");

  function moveActivePill() {
    if (!navLinksEl || !pill) return;
    var active = navLinksEl.querySelector("a.active");
    if (!active) { pill.classList.remove("ready"); return; }
    var wrapRect = navLinksEl.getBoundingClientRect();
    var r = active.getBoundingClientRect();
    var left = r.left - wrapRect.left;
    pill.style.width = r.width + "px";
    pill.style.transform = "translateX(" + left + "px)";
    pill.classList.add("ready");
  }

  // Reacciona a cualquier cambio de clase "active" hecho por destino.js
  if (navLinksEl) {
    var navObserver = new MutationObserver(function (mutations) {
      var relevant = mutations.some(function (m) {
        return m.type === "attributes" && m.attributeName === "class";
      });
      if (relevant) moveActivePill();
    });
    navLinksEl.querySelectorAll("a").forEach(function (a) {
      navObserver.observe(a, { attributes: true, attributeFilter: ["class"] });
    });
    // Además, sincroniza el estado activo del drawer móvil con el del nav de escritorio
    navObserver.observe = navObserver.observe; // no-op, keeps refs alive
  }

  window.addEventListener("resize", moveActivePill);
  window.addEventListener("load", moveActivePill);
  setTimeout(moveActivePill, 150);
  setTimeout(moveActivePill, 500);

  // Mantiene sincronizado el estado "active" del drawer móvil con el del nav principal
  function syncMobileActiveState(sectionName) {
    document.querySelectorAll("#mobileDrawerLinks a[data-sec]").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-sec") === sectionName);
    });
  }
  if (navLinksEl) {
    var activeSyncObserver = new MutationObserver(function () {
      var active = navLinksEl.querySelector("a.active[data-sec]");
      if (active) syncMobileActiveState(active.getAttribute("data-sec"));
    });
    navLinksEl.querySelectorAll("a[data-sec]").forEach(function (a) {
      activeSyncObserver.observe(a, { attributes: true, attributeFilter: ["class"] });
    });
  }

  /* ───────────── 3. Drawer móvil ───────────── */
  var drawerOverlay = document.getElementById("mobileDrawerOverlay");
  var hamburger = document.getElementById("navHamburger");

  window.toggleMobileDrawer = function (force) {
    if (!drawerOverlay) return;
    var open = typeof force === "boolean" ? force : !drawerOverlay.classList.contains("active");
    drawerOverlay.classList.toggle("active", open);
    if (hamburger) hamburger.classList.toggle("active", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  /* ───────────── 4. Selector de país glass ───────────── */
  var nativeSelect = document.getElementById("paisSelector");
  var switcher = document.getElementById("countrySwitcher");
  var trigger = document.getElementById("countryTrigger");
  var panel = document.getElementById("countryPanel");
  var optionsList = document.getElementById("countryOptionsList");
  var searchInput = document.getElementById("countrySearch");
  var triggerFlag = document.getElementById("countryTriggerFlag");
  var triggerName = document.getElementById("countryTriggerName");

  function flagMarkup(rawLabel, rawValue) {
    // Si el texto ya trae un emoji de bandera al inicio, se reutiliza tal cual.
    var emojiMatch = /^([\u{1F1E6}-\u{1F1FF}]{2}|[\u2600-\u27BF])\s*/u.exec(rawLabel || "");
    if (emojiMatch) return { flag: emojiMatch[1], label: rawLabel.slice(emojiMatch[0].length).trim() };
    // Si el value parece un código ISO de 2 letras, se intenta una imagen de bandera.
    if (rawValue && /^[a-zA-Z]{2}$/.test(rawValue.trim())) {
      var code = rawValue.trim().toLowerCase();
      return { img: "https://flagcdn.com/24x18/" + code + ".png", label: rawLabel };
    }
    return { initial: (rawLabel || "?").trim().charAt(0).toUpperCase(), label: rawLabel };
  }

  function renderCountryList(filter) {
    if (!optionsList || !nativeSelect) return;
    var term = (filter || "").trim().toLowerCase();
    var opts = Array.prototype.slice.call(nativeSelect.options);
    optionsList.innerHTML = "";

    var shown = 0;
    opts.forEach(function (opt, idx) {
      var label = opt.textContent || "";
      if (term && label.toLowerCase().indexOf(term) === -1) return;
      shown++;
      var info = flagMarkup(label, opt.value);
      var row = document.createElement("div");
      row.className = "country-option" + (opt.selected ? " selected" : "");
      row.setAttribute("role", "option");
      row.style.animationDelay = Math.min(idx * 0.02, 0.3) + "s";

      var flagHtml = info.img
        ? '<img src="' + info.img + '" alt="">'
        : (info.flag || info.initial || "🌎");
      row.innerHTML =
        '<span class="country-flag">' + flagHtml + '</span>' +
        '<span class="country-option-info">' +
          '<span class="country-option-name">' + (info.label || label) + '</span>' +
        '</span>' +
        '<span class="country-option-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>';

      row.addEventListener("click", function () {
        selectCountry(opt.value, label);
      });
      optionsList.appendChild(row);
    });

    if (shown === 0) {
      optionsList.innerHTML = '<div class="country-empty">Sin resultados</div>';
    }
  }

  function updateTrigger() {
    if (!nativeSelect) return;
    var opt = nativeSelect.options[nativeSelect.selectedIndex];
    if (!opt) return;
    var info = flagMarkup(opt.textContent, opt.value);
    if (triggerFlag) {
      triggerFlag.innerHTML = info.img ? '<img src="' + info.img + '" alt="">' : (info.flag || info.initial || "🌎");
    }
    if (triggerName) triggerName.textContent = info.label || opt.textContent;
  }

  function selectCountry(value, label) {
    if (!nativeSelect) return;
    nativeSelect.value = value;
    updateTrigger();
    renderCountryList(searchInput ? searchInput.value : "");
    closePanel();
    // Dispara el evento change (el atributo onchange="cambiarPais(this.value)" ya
    // escucha esto), y además, por si acaso, llama directo a cambiarPais si existe.
    nativeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    if (typeof window.cambiarPais === "function") {
      try { window.cambiarPais(value); } catch (e) { /* noop */ }
    }
  }

  function openPanel() {
    if (!switcher) return;
    renderCountryList("");
    switcher.classList.add("open");
    trigger && trigger.setAttribute("aria-expanded", "true");
    setTimeout(function () { searchInput && searchInput.focus(); }, 200);
  }
  function closePanel() {
    if (!switcher) return;
    switcher.classList.remove("open");
    trigger && trigger.setAttribute("aria-expanded", "false");
    if (searchInput) searchInput.value = "";
  }

  if (trigger) {
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (switcher.classList.contains("open")) closePanel();
      else openPanel();
    });
  }
  document.addEventListener("click", function (e) {
    if (switcher && !switcher.contains(e.target)) closePanel();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closePanel(); toggleMobileDrawer(false); }
  });
  if (searchInput) {
    searchInput.addEventListener("input", function () { renderCountryList(searchInput.value); });
  }

  // El <select> es llenado dinámicamente por destino.js (u otro script).
  // Se observa por si sus <option> cambian (carga inicial o cambio de idioma).
  if (nativeSelect) {
    updateTrigger();
    renderCountryList("");
    var selectObserver = new MutationObserver(function () {
      updateTrigger();
      if (switcher && switcher.classList.contains("open")) renderCountryList(searchInput ? searchInput.value : "");
    });
    selectObserver.observe(nativeSelect, { childList: true, attributes: true, subtree: true });
  }

  /* ───────────── 5. Sincroniza el label móvil de idioma con el de escritorio ───────────── */
  var langLabel = document.getElementById("langLabel");
  var langLabelMobile = document.getElementById("langLabelMobile");
  if (langLabel && langLabelMobile) {
    var langObserver = new MutationObserver(function () {
      langLabelMobile.textContent = langLabel.textContent;
    });
    langObserver.observe(langLabel, { childList: true, characterData: true, subtree: true });
  }
})();