import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { obtenerArtista, obtenerAlbumes } from '../services/spotifyApi'
import TarjetaAlbum from '../components/TarjetaAlbum'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'

function PaginaArtista() {
  const { id } = useParams()
  const [artista, setArtista] = useState(null)
  const [albumes, setAlbumes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      setError(null)
      try {
        const datosArtista = await obtenerArtista(id)
        const datosAlbumes = await obtenerAlbumes(id)
        setArtista(datosArtista)
        setAlbumes(datosAlbumes)
      } catch (err) {
        setError('No se pudo cargar el artista')
      }
      setCargando(false)
    }
    cargar()
  }, [id])

  if (cargando) return <Cargando />
  if (error) return <MensajeError mensaje={error} />
  if (!artista) return null

  const imagen = artista.images[0] ? artista.images[0].url : null

  return (
    <div className="page">
      <Link to="/" className="back-btn">← Volver al buscador</Link>

      <div className="artist-header">
        {imagen && <img src={imagen} alt={artista.name} className="artist-img" />}
        <div>
          <h1>{artista.name}</h1>
          <p>{artista.followers.total} seguidores</p>
          <p className="genres">{artista.genres.join(', ')}</p>
        </div>
      </div>

      <h2>Albumes</h2>
      {albumes.length === 0 ? (
        <p>Este artista no tiene albumes.</p>
      ) : (
        <div className="grid">
          {albumes.map((album) => (
            <TarjetaAlbum key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PaginaArtista
