/* Respuestas cerradas sobre contenido visible de KAVARI; no inventa datos externos. */
(function () {
  const has = (q, words) => words.some(word => q.includes(word));
  const lang = () => (localStorage.getItem('kavari-idioma') || 'es') === 'en';
  const clean = value => String(value || '').replace(/[<>]/g, '');
  const items = (list, mapper) => list.slice(0, 3).map(mapper).join('<br>');

  window.generateChatResponse = function (q, ctx) {
    const d = ctx?.country || ctx;
    const guides = ctx?.guias || [];
    const airlines = ctx?.aerolineas || [];
    const stays = ctx?.hospedajes || [];
    const en = lang();
    if (!d?.nombre) return window.generateGeneralResponse(q);
    const name = clean(d.nombre);

    if (has(q, ['visa','visado','pasaporte','document','migraci','entrar'])) {
      const card = d.practica?.info_cards?.find(x => x.icono === 'visa');
      return card ? `<strong>${en ? 'Information in KAVARI' : 'Información en KAVARI'}:</strong><br>${clean(card.texto)}` : (en ? `KAVARI does not have entry-requirement data for ${name}. Check an official consular source.` : `KAVARI no tiene requisitos de entrada para ${name}. Consulta una fuente consular oficial.`);
    }
    if (has(q, ['clima','temporada','época','epoca','lluvia','weather','season'])) {
      const seasons = d.practica?.temporadas || [];
      return seasons.length ? `<strong>${en ? 'Seasons shown for' : 'Temporadas disponibles para'} ${name}:</strong><br>${items(seasons, s => `<strong>${clean(s.nombre)}</strong> (${clean(s.meses)}): ${clean(s.descripcion)}`)}` : (en ? `There are no seasonal details in this KAVARI page. Open “Practical info” for available data.` : `Esta ficha no tiene temporadas cargadas. Abre “Info práctica” para ver los datos disponibles.`);
    }
    if (has(q, ['comida','comer','plato','gastronom','food','restaurant'])) {
      const dishes = d.gastronomia?.platos || [];
      return dishes.length ? `<strong>${en ? 'Food listed for' : 'Gastronomía de'} ${name}:</strong><br>${items(dishes, p => `<strong>${clean(p.nombre)}</strong>${p.descripcion ? ` — ${clean(p.descripcion)}` : ''}`)}` : (en ? 'This country page has no food entries yet.' : 'Esta ficha todavía no tiene platos cargados.');
    }
    if (has(q, ['lugares','lugar','destino','visitar','imperdible','places','visit'])) {
      const places = d.destinos || [];
      return places.length ? `<strong>${en ? 'Places in' : 'Lugares en'} ${name}:</strong><br>${items(places, p => `<strong>${clean(p.nombre)}</strong>${p.tag ? ` — ${clean(p.tag)}` : ''}`)}` : (en ? 'This country page has no destination entries yet.' : 'Esta ficha todavía no tiene lugares cargados.');
    }
    if (has(q, ['guía','guia','tour','guide'])) {
      return guides.length ? `<strong>${en ? 'Guides displayed in KAVARI' : 'Guías mostrados en KAVARI'}:</strong><br>${items(guides, g => `<strong>${clean(g.name)}</strong>${g.especialidades?.length ? ` — ${g.especialidades.map(clean).join(', ')}` : ''}${g.price ? ` · $${clean(g.price)}/h` : ''}`)}` : (en ? `No guides are listed for ${name} right now.` : `No hay guías listados para ${name} por ahora.`);
    }
    if (has(q, ['hotel','hospedaje','alojamiento','airbnb','stay'])) {
      return stays.length ? `<strong>${en ? 'Accommodation options shown' : 'Hospedajes mostrados'}:</strong><br>${items(stays, h => `<strong>${clean(h.nombre)}</strong>${h.precio_noche ? ` · $${clean(h.precio_noche)} ${clean(h.moneda || 'USD')}/noche` : ''}`)}` : (en ? 'No accommodation options are loaded for this page.' : 'No hay hospedajes cargados en esta ficha.');
    }
    if (has(q, ['vuelo','aerolínea','aerolinea','avión','flight','airline'])) {
      return airlines.length ? `<strong>${en ? 'Airlines shown' : 'Aerolíneas mostradas'}:</strong><br>${items(airlines, a => `<strong>${clean(a.nombre)}</strong>${a.precio_desde ? ` · ${en ? 'from' : 'desde'} $${clean(a.precio_desde)} ${clean(a.moneda || 'USD')}` : ''}`)}` : (en ? 'No airline options are loaded for this page.' : 'No hay aerolíneas cargadas en esta ficha.');
    }
    if (has(q, ['cultura','historia','tradición','tradicion','culture','history'])) {
      const culture = d.cultura;
      return culture ? `<strong>${en ? 'Culture in' : 'Cultura de'} ${name}:</strong><br>${clean(culture.descripcion || '')}` : (en ? 'This page has no culture information yet.' : 'Esta ficha aún no tiene información cultural.');
    }
    if (has(q, ['aventura','actividad','senderismo','adventure','activity'])) {
      const activities = d.aventura?.actividades || [];
      return activities.length ? `<strong>${en ? 'Activities in' : 'Actividades en'} ${name}:</strong><br>${items(activities, a => `<strong>${clean(a.nombre)}</strong>${a.descripcion ? ` — ${clean(a.descripcion)}` : ''}`)}` : (en ? 'This page has no activity entries yet.' : 'Esta ficha aún no tiene actividades cargadas.');
    }
    return en ? `I can only answer from the KAVARI page for <strong>${name}</strong>: places, food, culture, activities, guides, flights, stays and practical information.` : `Solo puedo responder con esta ficha de <strong>${name}</strong>: lugares, gastronomía, cultura, actividades, guías, vuelos, hospedajes e información práctica.`;
  };

  window.generateGeneralResponse = function (q) {
    const en = lang();
    if (has(q, ['plan','membres','membership'])) return en ? 'Open <strong>Plans</strong> in the navigation to choose Traveler, Explorer or Professional Guide. This demo saves your choice on this device.' : 'Abre <strong>Planes</strong> en la navegación para elegir Viajero, Explorador o Guía profesional. Esta demo guarda la elección en este dispositivo.';
    if (has(q, ['cuenta','registr','login','ingresar','join','account'])) return en ? 'Use <strong>Log in / Join</strong> in the navigation. Once registered, it becomes your account name.' : 'Usa <strong>Ingresar / Unirme</strong> en la navegación. Al registrarte, aparecerá el nombre de tu cuenta.';
    if (has(q, ['guía','guia','guide'])) return en ? 'The Guides page and every destination page show the guides that KAVARI has listed.' : 'La página Guías y cada destino muestran los guías que KAVARI tenga listados.';
    if (has(q, ['idioma','language','oscuro','tema','dark'])) return en ? 'Use the ES/EN and theme controls in the navigation. Your preference is saved.' : 'Usa los controles ES/EN y de tema en la navegación. Tu preferencia se guarda.';
    return en ? 'I answer only about KAVARI. Ask about destinations, guides, plans, your account, language or the theme.' : 'Respondo solo sobre KAVARI. Pregunta por destinos, guías, planes, tu cuenta, idioma o tema.';
  };
})();
