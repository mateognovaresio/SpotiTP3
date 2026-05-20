import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { obtenerAlbum } from '../services/spotifyApi'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'

function PaginaAlbum() {
  const { id } = useParams()
  const [album, setAlbum] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [reproduciendo, setReproduciendo] = useState(null)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      setError(null)
      try {
        const data = await obtenerAlbum(id)
        setAlbum(data)
      } catch (err) {
        setError('No se pudo cargar el album')
      }
      setCargando(false)
    }
    cargar()
  }, [id])

  if (cargando) return <Cargando />
  if (error) return <MensajeError mensaje={error} />
  if (!album) return null

  const imagen = album.images[0] ? album.images[0].url : null
  const canciones = album.tracks.items

  return (
    <div className="page">
      <Link to={'/artist/' + album.artists[0].id} className="back-btn">
        ← Volver al artista
      </Link>

      <div className="album-header">
        {imagen && <img src={imagen} alt={album.name} className="album-img" />}
        <div>
          <h1>{album.name}</h1>
          <p>{album.artists[0].name}</p>
          <p className="genres">{album.total_tracks} canciones</p>
        </div>
      </div>

      <h2>Canciones</h2>
      <ul className="track-list">
        {canciones.map((track, i) => (
          <li key={track.id} className="track-item">
            <span className="track-number">{i + 1}</span>
            <div className="track-info">
              <p className="track-name">{track.name}</p>
            </div>
            <button className="play-btn" onClick={() => setReproduciendo(track.id)}>
              ▶
            </button>
          </li>
        ))}
      </ul>

      {reproduciendo && (
        <div className="player">
          <iframe
            title="reproductor"
            src={'https://open.spotify.com/embed/track/' + reproduciendo}
            width="100%"
            height="80"
            allow="encrypted-media"
          ></iframe>
        </div>
      )}
    </div>
  )
}

export default PaginaAlbum
