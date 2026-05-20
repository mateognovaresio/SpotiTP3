import { useState } from 'react'
import { buscarArtistas } from '../services/spotifyApi'
import { useFavoritos } from '../context/FavoritosContext'
import TarjetaArtista from '../components/TarjetaArtista'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'

function PaginaInicio() {
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const { favoritos } = useFavoritos()

  async function handleSubmit(e) {
    e.preventDefault()
    if (busqueda === '') return

    setCargando(true)
    setError(null)

    try {
      const data = await buscarArtistas(busqueda)
      setResultados(data)
    } catch (err) {
      setError('No se pudo hacer la busqueda')
    }

    setCargando(false)
  }

  return (
    <div className="page">
      <h1>Buscador de Artistas</h1>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Ej: Coldplay, Dua Lipa..."
          className="search-input"
        />
        <button type="submit" className="search-btn">Buscar</button>
      </form>

      {favoritos.length > 0 && (
        <div className="favorites-section">
          <h2>Tus Favoritos</h2>
          <div className="grid">
            {favoritos.map((artista) => (
              <TarjetaArtista key={artista.id} artista={artista} />
            ))}
          </div>
        </div>
      )}

      {cargando && <Cargando />}
      {error && <MensajeError mensaje={error} />}

      {resultados.length > 0 && (
        <div>
          <h2>Resultados</h2>
          <div className="grid">
            {resultados.map((artista) => (
              <TarjetaArtista key={artista.id} artista={artista} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PaginaInicio
