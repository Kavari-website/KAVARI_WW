// Cambia el color de la barra de navegación cuando haces scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

// Botón de hamburguesa para abrir/cerrar el menú en celulares
document.getElementById('hamburger').addEventListener('click', function(){
  this.classList.toggle('open');
  document.getElementById('navLinks').classList.toggle('open');
});

// Actualiza el contador de cuántos países se están viendo
function updateCount() {
  const visible = document.querySelectorAll('.dest-card:not([style*="display: none"])').length;
  document.getElementById('countVisible').textContent = visible;
}

// Buscador: filtra los países según lo que escribe el usuario
function buscar() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  const cards = document.querySelectorAll('.dest-card');
  let visibles = 0;

  cards.forEach((card) => {
    const nombre = card.dataset.name || '';
    const texto  = card.innerText.toLowerCase();
    const match  = nombre.includes(q) || texto.includes(q);
    
    card.style.animation = 'none';
    
    if (match) {
      if (card.dataset.hideTimeout) {
        clearTimeout(parseInt(card.dataset.hideTimeout));
        card.removeAttribute('data-hide-timeout');
      }
      
      if (card.style.display === 'none') {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px) scale(0.95)';
        card.offsetHeight;
      }
      card.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
      visibles++;
    } else {
      if (card.style.display !== 'none' && !card.dataset.hideTimeout) {
        card.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px) scale(0.95)';
        
        const timeoutId = setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
          card.removeAttribute('data-hide-timeout');
        }, 300);
        card.setAttribute('data-hide-timeout', timeoutId);
      }
    }
  });

  const noRes = document.getElementById('noResults');
  document.getElementById('noTerm').textContent = q;
  noRes.style.display = visibles === 0 && q !== '' ? 'flex' : 'none';
  document.getElementById('countVisible').textContent = visibles || 36;
}

// Efecto de aparición cuando haces scroll
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, { threshold: 0.06 });

document.querySelectorAll('.dest-card').forEach((c, i) => {
  c.style.animationDelay = (i * 0.04) + 's';
  ro.observe(c);
});

// Redirige a la página de información del país seleccionado
function irAPais(codigoPais) {
  localStorage.setItem('paisSeleccionado', codigoPais);
  window.location.href = 'destino.html';
}

// ============================================
// TRADUCCIÓN DE DESCRIPCIONES DE PAÍSES
// ============================================
function aplicarTraduccionesPaises() {
    const destMap = {
        'panama': 'destPanama',
        'colombia': 'destColombia',
        'mexico': 'destMexico',
        'costa-rica': 'destCostaRica',
        'peru': 'destPeru',
        'republica-dominicana': 'destRepublicaDominicana',
        'argentina': 'destArgentina',
        'brasil': 'destBrasil',
        'chile': 'destChile',
        'ecuador': 'destEcuador',
        'cuba': 'destCuba',
        'guatemala': 'destGuatemala',
        'bolivia': 'destBolivia',
        'venezuela': 'destVenezuela',
        'uruguay': 'destUruguay',
        'paraguay': 'destParaguay',
        'honduras': 'destHonduras',
        'nicaragua': 'destNicaragua',
        'el-salvador': 'destElSalvador',
        'belice': 'destBelize',
        'guyana': 'destGuyana',
        'trinidad-y-tobago': 'destTrinidadTobago',
        'jamaica': 'destJamaica',
        'puerto-rico': 'destPuertoRico',
        'bahamas': 'destBahamas',
        'haiti': 'destHaiti',
        'espana': 'destEspana',
        'portugal': 'destPortugal',
        'italia': 'destItalia',
        'francia': 'destFrancia',
        'japon': 'destJapon',
        'tailandia': 'destTailandia',
        'marruecos': 'destMasiaDios',
        'turquia': 'destTurquia',
        'grecia': 'destGrecia',
        'sudafrica': 'destSudafrica'
    };

    document.querySelectorAll('.dest-card').forEach(card => {
        const button = card.querySelector('.dest-btn');
        if (!button) return;

        const onclickAttr = button.getAttribute('onclick') || '';
        const onclickMatch = onclickAttr.match(/irAPais\('([^']+)'\)/);
        if (!onclickMatch) return;

        const pais = onclickMatch[1];
        const key = destMap[pais];
        if (key) {
            const descripcion = card.querySelector('.dest-info p');
            if (descripcion) {
                const traduccion = t(key);
                if (traduccion !== key) {
                    descripcion.textContent = traduccion;
                }
            }
        }
    });
}

// Escuchar cambios de idioma
window.addEventListener('kavari:langchange', function() {
    aplicarTraduccionesPaises();
});

// Al cargar la página, aplicar traducciones
document.addEventListener('DOMContentLoaded', function() {
    aplicarTraduccionesPaises();
});