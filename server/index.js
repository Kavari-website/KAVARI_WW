const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3007;

app.use(cors());
app.use(express.json());

let data = {};
try {
  const raw = fs.readFileSync(path.join(__dirname, '..', 'data', 'data.json'), 'utf-8');
  data = JSON.parse(raw);
} catch (e) {
  console.error('Failed to load data.json:', e.message);
}

const clean = value => String(value || '').replace(/[<>]/g, '');
const normalize = str => String(str || '')
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^\w\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const items = (list, mapper) => list.slice(0, 3).map(mapper).join('<br>');

const INTENTS = [
  {
    name: 'saludo',
    keywords: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hi', 'hello', 'hey', 'que tal'],
    handler: (d, ctx, en, name) => en
      ? `Hi! I'm the KAVARI assistant${name ? ` for ${name}` : ''}. Ask me about places, food, culture, activities, guides, flights, stays or practical info.`
      : `¡Hola! Soy el asistente de KAVARI${name ? ` para ${name}` : ''}. Pregúntame por lugares, gastronomía, cultura, actividades, guías, vuelos, hospedajes o info práctica.`
  },
  {
    name: 'gracias',
    keywords: ['gracias', 'genial', 'perfecto', 'excelente', 'thanks', 'thank you', 'great', 'awesome'],
    handler: (d, ctx, en) => en
      ? 'You\'re welcome! Anything else about your trip?'
      : '¡De nada! ¿Algo más sobre tu viaje?'
  },
  {
    name: 'ayuda',
    keywords: ['ayuda', 'que puedes hacer', 'que sabes', 'capacidades', 'help', 'what can you do'],
    handler: (d, ctx, en, name) => en
      ? `I can answer about ${name || 'this destination'}: places, food, culture, activities, guides, flights, accommodation, budget, transport, safety, connectivity and practical info.`
      : `Puedo responder sobre ${name || 'este destino'}: lugares, gastronomía, cultura, actividades, guías, vuelos, hospedajes, presupuesto, transporte, seguridad, conectividad e info práctica.`
  },
  {
    name: 'visa',
    keywords: ['visa', 'visado', 'pasaporte', 'documento', 'documentos', 'migracion', 'entrar', 'entrada', 'passport', 'document', 'requisitos'],
    handler: (d, ctx, en, name) => {
      const card = d.practica?.info_cards?.find(x => x.icono === 'visa');
      return card
        ? `<strong>${en ? 'Information in KAVARI' : 'Información en KAVARI'}:</strong><br>${clean(card.texto)}`
        : (en ? `KAVARI does not have entry-requirement data for ${name}. Check an official consular source.` : `KAVARI no tiene requisitos de entrada para ${name}. Consulta una fuente consular oficial.`);
    }
  },
  {
    name: 'clima',
    keywords: ['clima', 'temporada', 'temporadas', 'epoca', 'lluvia', 'lluvias', 'calor', 'frio', 'weather', 'season', 'seasons', 'rain'],
    handler: (d, ctx, en, name) => {
      const seasons = d.practica?.temporadas || [];
      return seasons.length
        ? `<strong>${en ? 'Seasons shown for' : 'Temporadas disponibles para'} ${name}:</strong><br>${items(seasons, s => `<strong>${clean(s.nombre)}</strong> (${clean(s.meses)}): ${clean(s.descripcion)}`)}`
        : (en ? 'There are no seasonal details in this KAVARI page. Open "Practical info" for available data.' : 'Esta ficha no tiene temporadas cargadas. Abre "Info práctica" para ver los datos disponibles.');
    }
  },
  {
    name: 'gastronomia',
    keywords: ['comida', 'comer', 'plato', 'platos', 'gastronomia', 'restaurante', 'restaurantes', 'food', 'dish', 'restaurant', 'eat'],
    handler: (d, ctx, en, name) => {
      const dishes = d.gastronomia?.platos || [];
      return dishes.length
        ? `<strong>${en ? 'Food listed for' : 'Gastronomía de'} ${name}:</strong><br>${items(dishes, p => `<strong>${clean(p.nombre)}</strong>${p.descripcion ? ` — ${clean(p.descripcion)}` : ''}`)}`
        : (en ? 'This country page has no food entries yet.' : 'Esta ficha todavía no tiene platos cargados.');
    }
  },
  {
    name: 'lugares',
    keywords: ['lugares', 'lugar', 'destino', 'destinos', 'visitar', 'imperdible', 'imperdibles', 'places', 'place', 'visit', 'sightseeing'],
    handler: (d, ctx, en, name) => {
      const places = d.destinos || [];
      return places.length
        ? `<strong>${en ? 'Places in' : 'Lugares en'} ${name}:</strong><br>${items(places, p => `<strong>${clean(p.nombre)}</strong>${p.tag ? ` — ${clean(p.tag)}` : ''}`)}`
        : (en ? 'This country page has no destination entries yet.' : 'Esta ficha todavía no tiene lugares cargados.');
    }
  },
  {
    name: 'guias',
    keywords: ['guia', 'guias', 'tour', 'tours', 'guide', 'guides'],
    handler: (d, ctx, en, name) => {
      const guides = ctx?.guias || [];
      return guides.length
        ? `<strong>${en ? 'Guides displayed in KAVARI' : 'Guías mostrados en KAVARI'}:</strong><br>${items(guides, g => `<strong>${clean(g.name)}</strong>${g.especialidades?.length ? ` — ${g.especialidades.map(clean).join(', ')}` : ''}${g.price ? ` · $${clean(g.price)}/h` : ''}`)}`
        : (en ? `No guides are listed for ${name} right now.` : `No hay guías listados para ${name} por ahora.`);
    }
  },
  {
    name: 'hospedaje',
    keywords: ['hotel', 'hoteles', 'hospedaje', 'hospedajes', 'alojamiento', 'airbnb', 'stay', 'stays', 'accommodation', 'hostal', 'donde dormir'],
    handler: (d, ctx, en) => {
      const stays = ctx?.hospedajes || [];
      return stays.length
        ? `<strong>${en ? 'Accommodation options shown' : 'Hospedajes mostrados'}:</strong><br>${items(stays, h => `<strong>${clean(h.nombre)}</strong>${h.precio_noche ? ` · $${clean(h.precio_noche)} ${clean(h.moneda || 'USD')}/noche` : ''}`)}`
        : (en ? 'No accommodation options are loaded for this page.' : 'No hay hospedajes cargados en esta ficha.');
    }
  },
  {
    name: 'vuelos',
    keywords: ['vuelo', 'vuelos', 'aerolinea', 'aerolineas', 'avion', 'flight', 'flights', 'airline', 'airlines', 'boleto', 'tiquete'],
    handler: (d, ctx, en) => {
      const airlines = ctx?.aerolineas || [];
      return airlines.length
        ? `<strong>${en ? 'Airlines shown' : 'Aerolíneas mostradas'}:</strong><br>${items(airlines, a => `<strong>${clean(a.nombre)}</strong>${a.precio_desde ? ` · ${en ? 'from' : 'desde'} $${clean(a.precio_desde)} ${clean(a.moneda || 'USD')}` : ''}`)}`
        : (en ? 'No airline options are loaded for this page.' : 'No hay aerolíneas cargadas en esta ficha.');
    }
  },
  {
    name: 'cultura',
    keywords: ['cultura', 'historia', 'tradicion', 'tradiciones', 'culture', 'history', 'costumbres'],
    handler: (d, ctx, en, name) => {
      const culture = d.cultura;
      return culture
        ? `<strong>${en ? 'Culture in' : 'Cultura de'} ${name}:</strong><br>${clean(culture.descripcion || '')}`
        : (en ? 'This page has no culture information yet.' : 'Esta ficha aún no tiene información cultural.');
    }
  },
  {
    name: 'aventura',
    keywords: ['aventura', 'actividad', 'actividades', 'senderismo', 'excursion', 'adventure', 'activity', 'activities', 'hiking'],
    handler: (d, ctx, en, name) => {
      const activities = d.aventura?.actividades || [];
      return activities.length
        ? `<strong>${en ? 'Activities in' : 'Actividades en'} ${name}:</strong><br>${items(activities, a => `<strong>${clean(a.nombre)}</strong>${a.descripcion ? ` — ${clean(a.descripcion)}` : ''}`)}`
        : (en ? 'This page has no activity entries yet.' : 'Esta ficha aún no tiene actividades cargadas.');
    }
  },
  {
    name: 'presupuesto',
    keywords: ['presupuesto', 'precio', 'precios', 'costo', 'costos', 'cuanto cuesta', 'budget', 'price', 'cost', 'money', 'dinero'],
    handler: (d, ctx, en) => {
      const stays = ctx?.hospedajes || [];
      const airlines = ctx?.aerolineas || [];
      const guides = ctx?.guias || [];
      const bits = [];
      if (stays.length) bits.push(`${en ? 'Stays from' : 'Hospedajes desde'} $${clean(Math.min(...stays.map(s => Number(s.precio_noche) || Infinity)))}`);
      if (airlines.length) bits.push(`${en ? 'Flights from' : 'Vuelos desde'} $${clean(Math.min(...airlines.map(a => Number(a.precio_desde) || Infinity)))}`);
      if (guides.length) bits.push(`${en ? 'Guides from' : 'Guías desde'} $${clean(Math.min(...guides.map(g => Number(g.price) || Infinity)))}/h`);
      return bits.length
        ? `<strong>${en ? 'Rough prices shown in KAVARI' : 'Precios de referencia en KAVARI'}:</strong><br>${bits.join('<br>')}`
        : (en ? 'There is no pricing loaded on this page yet.' : 'Esta ficha aún no tiene precios cargados.');
    }
  },
  {
    name: 'practica',
    keywords: ['moneda', 'idioma local', 'enchufe', 'electricidad', 'sim', 'internet', 'conectividad', 'wifi', 'currency', 'plug', 'electricity', 'connectivity'],
    handler: (d, ctx, en, name) => {
      const cards = d.practica?.info_cards || [];
      return cards.length
        ? `<strong>${en ? 'Practical info for' : 'Info práctica de'} ${name}:</strong><br>${items(cards, c => clean(c.texto))}`
        : (en ? 'This page has no practical info cards yet.' : 'Esta ficha aún no tiene tarjetas de info práctica.');
    }
  }
];

function bestIntent(qNorm) {
  let best = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (qNorm.includes(kw)) score += kw.split(' ').length;
    }
    if (score > bestScore) { bestScore = score; best = intent; }
  }
  return bestScore > 0 ? best : null;
}

function generateChatResponse(q, ctx) {
  const d = ctx?.country || ctx;
  const en = ctx?.lang === 'en';
  if (!d?.nombre) return generateGeneralResponse(q, en);
  const name = clean(d.nombre);
  const qNorm = normalize(q);

  const intent = bestIntent(qNorm);
  if (intent) return intent.handler(d, ctx, en, name);

  const topics = en
    ? ['places', 'food', 'culture', 'activities', 'guides', 'flights', 'stays', 'budget', 'practical info']
    : ['lugares', 'gastronomía', 'cultura', 'actividades', 'guías', 'vuelos', 'hospedajes', 'presupuesto', 'info práctica'];
  return en
    ? `I can only answer from the KAVARI page for <strong>${name}</strong>. Try asking about: ${topics.join(', ')}.`
    : `Solo puedo responder con esta ficha de <strong>${name}</strong>. Prueba preguntando por: ${topics.join(', ')}.`;
}

function generateGeneralResponse(q, en) {
  const qNorm = normalize(q);

  if (/\b(hola|buenas|hi|hello|hey)\b/.test(qNorm)) {
    return en ? 'Hi! Ask me about destinations, guides, plans, your account, language or theme.' : '¡Hola! Pregúntame por destinos, guías, planes, tu cuenta, idioma o tema.';
  }
  if (/\b(gracias|thanks|thank you)\b/.test(qNorm)) {
    return en ? 'You\'re welcome!' : '¡De nada!';
  }
  if (/\b(plan|membres|membership)\b/.test(qNorm)) {
    return en ? 'Open <strong>Plans</strong> in the navigation to choose Traveler, Explorer or Professional Guide. This demo saves your choice on this device.' : 'Abre <strong>Planes</strong> en la navegación para elegir Viajero, Explorador o Guía profesional. Esta demo guarda la elección en este dispositivo.';
  }
  if (/\b(cuenta|registr|login|ingresar|join|account)\b/.test(qNorm)) {
    return en ? 'Use <strong>Log in / Join</strong> in the navigation. Once registered, it becomes your account name.' : 'Usa <strong>Ingresar / Unirme</strong> en la navegación. Al registrarte, aparecerá el nombre de tu cuenta.';
  }
  if (/\b(guia|guias|guide)\b/.test(qNorm)) {
    return en ? 'The Guides page and every destination page show the guides that KAVARI has listed.' : 'La página Guías y cada destino muestran los guías que KAVARI tenga listados.';
  }
  if (/\b(idioma|language|oscuro|tema|dark)\b/.test(qNorm)) {
    return en ? 'Use the ES/EN and theme controls in the navigation. Your preference is saved.' : 'Usa los controles ES/EN y de tema en la navegación. Tu preferencia se guarda.';
  }
  return en
    ? 'I answer only about KAVARI. Ask about destinations, guides, plans, your account, language or the theme.'
    : 'Respondo solo sobre KAVARI. Pregunta por destinos, guías, planes, tu cuenta, idioma o tema.';
}

function findCountry(query) {
  const q = normalize(query);
  const codes = Object.keys(data).filter(k => k !== 'top10' && data[k]?.nombre);
  for (const code of codes) {
    const c = data[code];
    const nameNorm = normalize(c.nombre);
    if (nameNorm.includes(q) || q.includes(nameNorm)) {
      return { code, ...c };
    }
  }
  return null;
}

function findCountryByName(nameQuery) {
  const q = normalize(nameQuery);
  const codes = Object.keys(data).filter(k => k !== 'top10' && data[k]?.nombre);
  for (const code of codes) {
    const c = data[code];
    const nameNorm = normalize(c.nombre);
    if (nameNorm === q || nameNorm.includes(q) || q.includes(nameNorm)) {
      return { code, ...c };
    }
  }
  return null;
}

app.post('/api/chat', (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ reply: 'Message is required.' });
    }

    const ctx = {
      country: context?.country || null,
      guias: context?.guias || [],
      aerolineas: context?.aerolineas || [],
      hospedajes: context?.hospedajes || [],
      lang: context?.lang || 'es'
    };

    const reply = generateChatResponse(message, ctx);
    res.json({ reply, intent: null });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ reply: 'Lo siento, ocurrió un error al procesar tu mensaje.' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/countries', (req, res) => {
  const codes = Object.keys(data).filter(k => k !== 'top10' && data[k]?.nombre);
  const countries = codes.map(code => ({
    code,
    nombre: data[code].nombre,
    bandera: data[code].bandera,
    continente: data[code].continente
  }));
  res.json(countries);
});

app.get('/api/country/:code', (req, res) => {
  const c = data[req.params.code];
  if (!c) return res.status(404).json({ error: 'Country not found' });
  res.json(c);
});

app.listen(PORT, () => {
  console.log(`KAVARI Chat API running on http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  POST /api/chat    - Chat with the assistant`);
  console.log(`  GET  /api/health   - Health check`);
  console.log(`  GET  /api/countries - List all countries`);
  console.log(`  GET  /api/country/:code - Get country data`);
});
