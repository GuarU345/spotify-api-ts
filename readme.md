# Backend Para Manejo de Clon Tipo Spotify

## Descripcion

Esta es una api construida con nodejs y express js que proporciona las funciones mas esenciales que tiene spotify
ya sea agregar artistas y visualizarlos, crear albumes y agregarles canciones, los usuarios pueden dar like
o dislike a una cancion en especifico incluso tener sus propios playlist con las canciones que vayan agregando

## Tabla de contenidos

1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Uso](#uso)
4. [Rutas](#rutas)
5. [Contribuciones](#contribuciones)
6. [Contacto](#contacto)

## Requisitos

- Node.js (v18 o superior)
- npm (normalmente se instala con Node.js)

## Instalación

```bash
git clone https://github.com/GuarU345/spotify-api-ts.git
```

```bash
cd nombre-del-proyecto
```

```bash
npm install
```

```bash
npx prisma migrate dev --name init
```

```bash
npm run dev
```

## Uso

Esta API te permite acceder a las funciones esenciales similares a las que ofrece Spotify, como agregar artistas, crear álbumes, agregar canciones, dar like o dislike a una canción y administrar tus propias listas de reproducción personalizadas. A continuación, se detallan los pasos y ejemplos de cómo utilizar algunas de las funcionalidades principales

## Ejemplo de solicitud GET a la ruta /api/songs

curl http://localhost:3000/api/ejemplo

## Rutas

### Obtener todas las canciones

- **Ruta:** `GET api/songs`
- **Descripcion:** Obtiene la lista de canciones
- **Parametros de consulta:** Ninguno.
- **Ejemplo de respuesta:**

```json
[
  {
    "authorId": 1,
    "authorName": "Post Malone",
    "album": {
      "albumId": 1,
      "albumName": "Hollywoods Bleeding",
      "albumImage": "https://upload.wikimedia.org/wikipedia/en/5/58/Post_Malone_-_Hollywood%27s_Bleeding.png"
    },
    "song": {
      "songId": 1,
      "songName": "Saint-Tropez"
    }
  },
  {
    "authorId": 1,
    "authorName": "Post Malone",
    "album": {
      "albumId": 1,
      "albumName": "Hollywoods Bleeding",
      "albumImage": "https://upload.wikimedia.org/wikipedia/en/5/58/Post_Malone_-_Hollywood%27s_Bleeding.png"
    },
    "song": {
      "songId": 2,
      "songName": "Enemies"
    }
  }
]
```

## Contribuciones

- Crea un fork del repositorio
- Crea una nueva rama para tus cambios: `git checkout -b nueva-caracteristica`
- Realiza tus cambios y haz commit: `git commit -m "añade nueva caracteristica`
- Envia tus cambios: `git push origin tu-rama`

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en ponerte en contacto conmigo
en [abelmtz34@outlook.com] o con mi perfil de github GuarU345.

¡Gracias por utilizar la API!
