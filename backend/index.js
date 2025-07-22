const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const peliculasRouter = require('./routes/peliculas');
require('dotenv').config();
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const peliculas = [
  {
    titulo: "Inception",
    genero: "Ciencia ficción",
    descripcion: "Un ladrón que roba secretos a través de la manipulación de sueños.",
    poster: "url_de_poster_inception.jpg"
  },
  {
    titulo: "Titanic",
    genero: "Drama/Romance",
    descripcion: "Historia del naufragio del Titanic.",
    poster: "url_de_poster_titanic.jpg"
  }
];

app.get('/api/peliculas', (req, res) => {
  res.json(peliculas);
});

// Conectar a MongoDB usando URI del .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// Rutas
app.use('/api/peliculas', peliculasRouter);

// Ruta para recomendaciones (POST) con OpenRouter
app.post('/api/recomendaciones', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/cypher-alpha:free',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const recomendacion = response.data.choices[0].message.content;
    res.json({ recomendacion });
  } catch (error) {
    console.error('Error en la API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error en el servidor proxy' });
  }
});

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});