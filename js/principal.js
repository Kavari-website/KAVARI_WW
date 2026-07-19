
document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('guiasModalOverlay');
    const openBtn = document.getElementById('guiasNavBtn');
    const closeBtn = document.getElementById('closeGuiasModalBtn');
    const selectCountry = document.getElementById('guideCountry');
    const registerForm = document.getElementById('guideRegisterFormIndex');

    function getLang() {
        return localStorage.getItem('kavariIdioma') || localStorage.getItem('idioma') || 'es';
    }

    function loadTouristCountries() {
        if (!selectCountry || selectCountry.dataset.loaded === '1') return;
        const lang = getLang();
        const placeholder = lang === 'en' ? 'Select a country' : 'Selecciona un país';
        fetch('data/data.json')
            .then(res => res.json())
            .then(data => {
                selectCountry.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
                Object.keys(data)
                    .sort((a, b) => (data[a].nombre || a).localeCompare(data[b].nombre || a, lang))
                    .forEach(key => {
                        const country = data[key];
                        const opt = document.createElement('option');
                        opt.value = key;
                        opt.textContent = country.nombre || key;
                        selectCountry.appendChild(opt);
                    });
                selectCountry.dataset.loaded = '1';
            })
            .catch(() => {
                selectCountry.innerHTML = `<option value="" disabled selected>${lang === 'en' ? 'Error loading countries' : 'Error al cargar países'}</option>`;
            });
    }

    if (openBtn && modalOverlay) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modalOverlay.style.display = 'flex';
            setTimeout(() => modalOverlay.classList.add('active'), 10);
            loadTouristCountries();
        });
    }

    function closeGuiasModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            setTimeout(() => { modalOverlay.style.display = 'none'; }, 400);
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeGuiasModal);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeGuiasModal();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = getLang() === 'en'
                ? 'Thank you for registering! Your guide profile has been submitted for review. We will contact you soon.'
                : '¡Gracias por registrarte! Tu perfil de guía ha sido enviado para revisión. Nos pondremos en contacto contigo pronto.';
            alert(msg);
            registerForm.reset();
            closeGuiasModal();
        });
    }

    window.addEventListener('kavari:langchange', () => {
        if (selectCountry) {
            selectCountry.dataset.loaded = '';
            if (modalOverlay && modalOverlay.style.display === 'flex') loadTouristCountries();
        }
    });
});

