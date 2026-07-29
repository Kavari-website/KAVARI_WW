const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Coloca aquí tu clave de Gemini
const API_KEY = 'AQ.Ab8RN6KQDL4Wqtp9ealSsBysbI6SKk0qNNxV_TUV9ovDVq7a7Q'; // Pega tu clave aquí
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// El "prompt de sistema" que lo convierte en tu asistente especializado
const SYSTEM_PROMPT = `
Eres el asistente de viajes KAVARI, especializado en panama,. 
Responde  en español cuando el modo del sitio este en espa;ol y si esta en ingles responde en ingles, con tono amable y profesional. 
Ofrece información sobre cultura, gastronomía, requisitos de viaje, clima, lugares imperdibles (Casco Viejo, Canal de Panamá, San Blas, Boquete).
Si no sabes algo,  lee la informacion del sitio weby si no busca informacion precisa y conciso y real .
Sé conciso y útil.
`;

app.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) return res.status(400).json({ error: 'Mensaje vacío' });

  try {
    // Construimos el historial con el prompt de sistema al inicio
    const chatHistory = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      ...history
    ];

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Asistente KAVARI corriendo en http://localhost:${PORT}`));