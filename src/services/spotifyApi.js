import axios from 'axios'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

// pide el token a spotify
async function obtenerToken() {
  const body = new URLSearchParams()
  body.append('grant_type', 'client_credentials')
  body.append('client_id', CLIENT_ID)
  body.append('client_secret', CLIENT_SECRET)

  const respuesta = await axios.post('https://accounts.spotify.com/api/token', body)
  return respuesta.data.access_token
}

// busca artistas por nombre
export async function buscarArtistas(nombre) {
  const token = await obtenerToken()
  const respuesta = await axios.get('https://api.spotify.com/v1/search', {
    headers: { Authorization: 'Bearer ' + token },
    params: { q: nombre, type: 'artist', limit: 10 },
  })
  return respuesta.data.artists.items
}

// trae los datos de un artista
export async function obtenerArtista(id) {
  const token = await obtenerToken()
  const respuesta = await axios.get('https://api.spotify.com/v1/artists/' + id, {
    headers: { Authorization: 'Bearer ' + token },
  })
  return respuesta.data
}

// trae los albumes de un artista
export async function obtenerAlbumes(id) {
  const token = await obtenerToken()
  const respuesta = await axios.get('https://api.spotify.com/v1/artists/' + id + '/albums', {
    headers: { Authorization: 'Bearer ' + token },
    params: { limit: 10 },
  })
  return respuesta.data.items
}

// trae un album con sus canciones
export async function obtenerAlbum(id) {
  const token = await obtenerToken()
  const respuesta = await axios.get('https://api.spotify.com/v1/albums/' + id, {
    headers: { Authorization: 'Bearer ' + token },
  })
  return respuesta.data
}
