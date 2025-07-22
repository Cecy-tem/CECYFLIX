import React, { useState, useEffect } from 'react';
import CatalogoPeliculas from './CatalogoPeliculas';

function App() {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modoDescripcion, setModoDescripcion] = useState(false);
  const [recomendacion, setRecomendacion] = useState('');

  // Cargar películas al montar el componente
  useEffect(() => {
    fetch('/api/peliculas')
      .then(res => res.json())
      .then(data => {
        setPeliculas(data);
        setPeliculasFiltradas(data);
      })
      .catch(err => console.error('Error al obtener películas:', err));
  }, []);

  // Búsqueda tradicional por título/género
  const handleBuscar = (e) => {
    e.preventDefault();
    const texto = busqueda.toLowerCase();
    const resultado = peliculas.filter(p =>
      p.titulo.toLowerCase().includes(texto) ||
      (p.genero && p.genero.toLowerCase().includes(texto)) ||
      p.titulo.toLowerCase().startsWith(texto)
    );
    setPeliculasFiltradas(resultado);
    setRecomendacion('');
  };

  // Búsqueda por descripción usando IA (OpenRouter)
  const handleBuscarPorDescripcion = async () => {
    try {
      const res = await fetch('/api/recomendaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Dame una recomendación basada en esta descripción: ${busqueda}. Usa solo películas de este catálogo: ${peliculas.map(p => p.titulo).join(', ')}.` 
        }),
      });
      const data = await res.json();
      setRecomendacion(data.recomendacion);

      const seleccionadas = peliculas.filter(p =>
        data.recomendacion.toLowerCase().includes(p.titulo.toLowerCase())
      );
      if (seleccionadas.length > 0) {
        setPeliculasFiltradas(seleccionadas);
      }
    } catch (err) {
      console.error('Error con IA:', err);
    }
  };

  return (
    <div className="App">
      <h1>Cecyflix - Catálogo de Películas</h1>
      
      <CatalogoPeliculas />

      <form className="buscador" onSubmit={handleBuscar}>
        <input
          type="text"
          placeholder={modoDescripcion ? 'Describe la peli que buscas...' : 'Busca por título o género'}
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        {!modoDescripcion && <button type="submit">Buscar</button>}
        {modoDescripcion && <button type="button" onClick={handleBuscarPorDescripcion}>Buscar con IA</button>}
      </form>

      <button onClick={() => {
        setModoDescripcion(!modoDescripcion);
        setBusqueda('');
        setPeliculasFiltradas(peliculas);
        setRecomendacion('');
      }}>
        {modoDescripcion ? 'Modo Búsqueda Tradicional' : 'Modo Búsqueda por Descripción (IA)'}
      </button>

      {recomendacion && (
        <div className="bloque-recomendaciones">
          <h2>IA sugiere:</h2>
          <p>{recomendacion}</p>
        </div>
      )}

      <div className="grid">
        {peliculasFiltradas.map((p, i) => (
          <div className="tarjeta" key={i}>
            <img src={p.poster} alt={p.titulo} />
            <div className="info">
              <h3>{p.titulo}</h3>
              <p>{p.genero}</p>
              <span>{p.descripcion ? p.descripcion.slice(0, 60) + '...' : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


