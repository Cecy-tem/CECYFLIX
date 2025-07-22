const express = require('express');
const router = express.Router();
const Pelicula = require('../models/Pelicula');

// Ruta GET para obtener todas las películas
router.get('/', async (req, res) => {
  try {
    const peliculas = await Pelicula.find();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener películas' });
  }
});

// Ruta POST para agregar una nueva película
router.post('/', async (req, res) => {
  const { titulo, genero, descripcion, poster } = req.body;

  const nuevaPelicula = new Pelicula({
    titulo,
    genero,
    descripcion,
    poster
  });

  try {
    const peliculaGuardada = await nuevaPelicula.save();
    res.status(201).json(peliculaGuardada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al guardar la película' });
  }
});

// Ruta PUT para actualizar una película por id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, genero, descripcion, poster } = req.body;

  try {
    const peliculaActualizada = await Pelicula.findByIdAndUpdate(
      id,
      { titulo, genero, descripcion, poster },
      { new: true }
    );
    if (!peliculaActualizada) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }
    res.json(peliculaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar la película' });
  }
});

// Ruta DELETE para borrar una película por id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const peliculaEliminada = await Pelicula.findByIdAndDelete(id);
    if (!peliculaEliminada) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }
    res.json({ mensaje: 'Película eliminada' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar la película' });
  }
});

module.exports = router;
