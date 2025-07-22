import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CatalogoPeliculas = () => {
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    axios.get('/api/peliculas')
      .then(res => setPeliculas(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Catálogo de Películas</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {peliculas.slice(0, 3).map(pelicula => (
          <div key={pelicula.id} style={{ width: '300px', border: '1px solid #ccc', padding: '10px' }}>
            <img 
              src={pelicula.poster} 
              alt={pelicula.titulo} 
              style={{ width: '100%', height: 'auto' }} 
            />
            <h3>{pelicula.titulo}</h3>
            <p><strong>Género:</strong> {pelicula.genero}</p>
            <p>{pelicula.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogoPeliculas;
