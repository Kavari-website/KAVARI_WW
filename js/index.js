
let top10Data = {};
let paquetesData = {};
window.homeDataLoaded = false;
window.homeDataPromise = null;

const top10ModalKeyMap = {
    'obelisco': 'Obelisco',
    'torre-eiffel': 'TorreEiffel',
    'cristo-redentor': 'Cristo',
    'torres-del-paine': 'TorresPaine',
    'cartagena': 'Cartagena',
    'japon': 'Japon',
    'machu-picchu': 'MachuPicchu',
    'petra': 'Petra',
    'chichen-itza': 'Chichen',
    'times-square': 'TimesSquare'
};

const paqueteModalKeyMap = {
    'francia': 'Francia',
    'china': 'China',
    'india': 'India',
    'italia': 'Italia',
    'panama': 'Panama',
    'el-salvador': 'ElSalvador'
};
 // Navbar scroll effect
    window.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });


function getTop10TranslationKey(id) {
    return top10ModalKeyMap[id] || id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function getPaqueteTranslationKey(id) {
    return paqueteModalKeyMap[id] || id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function getById(id) {
    return document.getElementById(id);
}

function translateOrDefault(key, fallback) {
    if (typeof t !== 'function') return fallback;
    const value = t(key);
    return value === key ? fallback : value;
}

function loadHomeData() {
    if (window.homeDataPromise) return window.homeDataPromise;
    window.homeDataPromise = fetch('data/data.json')
        .then(res => res.json())
        .then(data => {
            top10Data = data.top10 || {};
            paquetesData = data.paquetes || {};
            window.homeDataLoaded = true;
        })
        .catch(error => {
            console.error('Error cargando data de inicio:', error);
        });
    return window.homeDataPromise;
}

// Función para abrir el modal del Top 10
async function abrirModalTop10(id) {
    if (!window.homeDataLoaded) await loadHomeData();
    const data = top10Data[id];
    if (!data) return;
    
    // Guardar el ID del modal abierto para poder actualizarlo al cambiar idioma
    window.currentTop10ModalId = id;

    const overlay = getById('top10ModalOverlay');
    if (!overlay) return;

    const imgEl = getById('top10ModalImg');
    const tagEl = getById('top10ModalTag');
    const titleEl = getById('top10ModalTitle');
    const descEl = getById('top10ModalDesc');
    const factsEl = getById('top10ModalFacts');
    const goBtn = getById('top10ModalGoBtn');

    if (imgEl) {
        imgEl.src = data.img;
        imgEl.alt = data.title;
    }
    if (tagEl) tagEl.textContent = data.tag;

    const translationKey = getTop10TranslationKey(id);
    if (titleEl) titleEl.textContent = translateOrDefault('topTitulo' + translationKey, data.title);
    if (descEl) descEl.textContent = translateOrDefault('topDesc' + translationKey, data.desc);

    // Chips de datos - parsear desde traducción
    const factsKey = 'topFacts' + translationKey;
    const factString = typeof t === 'function' ? t(factsKey) : factsKey;
    const facts = factString === factsKey ? data.facts : factString.split('|');
    if (factsEl) {
        factsEl.innerHTML = facts
            .map(f => `<span class="top10-modal-fact">${f}</span>`).join('');
    }

    // Botón "Quiero ir" guarda el país y redirige
    if (goBtn) {
        goBtn.onclick = function() {
            localStorage.setItem('paisSeleccionado', data.pais);
            window.location.href = 'destino.html';
        };
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModalTop10() {
    document.getElementById('top10ModalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Cerrar el modal al hacer clic fuera
document.getElementById('top10ModalOverlay').addEventListener('click', function(e) {
    if (e.target === this) cerrarModalTop10();
});
document.getElementById('top10ModalClose').addEventListener('click', cerrarModalTop10);

// Función para abrir el modal de detalle del paquete
async function abrirModalPaquete(id) {
    if (!window.homeDataLoaded) await loadHomeData();
    const data = paquetesData[id];
    if (!data) return;
    
    // Guardar el ID del modal abierto para poder actualizarlo al cambiar idioma
    window.currentPaqueteModalId = id;

    const overlay = getById('paqueteModalOverlay');
    if (!overlay) return;

    const imgEl = getById('paqueteModalImg');
    const titleEl = getById('paqueteModalTitle');
    const precioEl = getById('paqueteModalPrecio');
    const descEl = getById('paqueteModalDesc');
    const includesEl = getById('paqueteModalIncludes');
    const itineraryEl = getById('paqueteModalItinerary');
    const destBtn = getById('paqueteModalDestBtn');

    if (imgEl) {
        imgEl.src = data.img;
        imgEl.alt = data.title;
    }
    if (titleEl) titleEl.textContent = data.title;
    if (precioEl) precioEl.innerHTML = data.precio;

    const paqueteKey = getPaqueteTranslationKey(id);
    if (descEl) descEl.textContent = translateOrDefault('paquete' + paqueteKey + 'Desc', data.desc);

    if (includesEl) {
        includesEl.innerHTML = data.includes
            .map(item => `<div class="paquete-include-item">${item}</div>`).join('');
    }

    if (itineraryEl) {
        itineraryEl.innerHTML = data.itinerary
            .map(d => `
                <div class="itinerary-day">
                    <div class="itin-day-num">${d.dia.split(' ')[1]}</div>
                    <div class="itin-day-text">
                        <h5>${d.titulo}</h5>
                        <p>${d.texto}</p>
                    </div>
                </div>
            `).join('');
    }

    if (destBtn) {
        destBtn.onclick = function(e) {
            e.preventDefault();
            localStorage.setItem('paisSeleccionado', data.pais);
            window.location.href = 'destino.html';
        };
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModalPaquete() {
    document.getElementById('paqueteModalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('paqueteModalOverlay').addEventListener('click', function(e) {
    if (e.target === this) cerrarModalPaquete();
});
document.getElementById('paqueteModalClose').addEventListener('click', cerrarModalPaquete);

// Función auxiliar para preseleccionar el país al ir al listado de paquetes
function seleccionarPais(pais) {
    localStorage.setItem('paisSeleccionado', pais);
}

// Scroll reveal para las tarjetas
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));



// Listener para actualizar modales cuando cambia el idioma
window.addEventListener('kavari:langchange', function(e) {
    const idioma = e.detail.idioma;
    
    // Si hay un modal de Top 10 abierto, actualizarlo
    if (window.currentTop10ModalId && document.getElementById('top10ModalOverlay').classList.contains('active')) {
        abrirModalTop10(window.currentTop10ModalId);
    }
    
    // Si hay un modal de paquete abierto, actualizarlo
    if (window.currentPaqueteModalId && document.getElementById('paqueteModalOverlay').classList.contains('active')) {
        abrirModalPaquete(window.currentPaqueteModalId);
    }
});

// Función auxiliar para actualizar el botón de idioma
function updateLangButton(idioma) {
    const btnLang = document.getElementById('btnLang');
    if (btnLang) {
        const langLabel = document.getElementById('langLabel');
        if (langLabel) {
            langLabel.textContent = idioma === 'en' ? 'EN' : 'ES';
        }
        btnLang.setAttribute('aria-label', idioma === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés');
    }
}

