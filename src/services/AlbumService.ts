import { prisma } from "../utils/prisma";

// Crea un nuevo álbum para un artista dado.
const createArtistAlbumService = async (artistId, body, album_image) => {
  const { name, release_date } = body;
  try {
    const newAlbum = await prisma.album.create({
      data: {
        name,
        release_date,
        album_image,
        artist_id: Number(artistId),
      },
    });
    return newAlbum;
  } catch (error) {
    throw new Error("Error al crear un nuevo album");
  }
};

//Obtiene un album por su id
const getAlbumByIdService = async (albumId) => {
  try {
    const album = await prisma.album.findUnique({
      where: {
        id: Number(albumId),
      },
    });

    return album;
  } catch (error) {
    throw new Error("Error al buscar el album");
  }
};

// Obtiene todos los álbumes con información detallada del artista.
const getAlbumsService = async () => {
  try {
    const albums = await prisma.album.findMany({
      include: {
        artist: true,
      },
    });
    if (!albums) {
      throw new Error("No se encontraron albums");
    }
    return albums;
  } catch (error) {
    throw new Error("Error al traer los albums");
  }
};

// Obtiene todos los álbumes de un artista por su ID.
const getAlbumsByArtistService = async (artistId) => {
  try {
    const artist = await prisma.artist.findUnique({
      include: {
        albums: true,
      },
      where: {
        id: Number(artistId),
      },
    });

    if (!artist) {
      throw new Error("Artista no encontrado");
    }

    const artistAlbums = {
      author: artist?.name,
      albums:
        artist.albums.length > 0
          ? artist?.albums.map((album) => {
              return {
                id: album.id,
                albumName: album.name,
                releaseDate: album.release_date,
              };
            })
          : "No se encontraron albums",
    };
    return artistAlbums;
  } catch (error) {
    throw new Error("Error al traer los albums del artista");
  }
};

export const AlbumService = {
  getAlbumsService,
  getAlbumByIdService,
  getAlbumsByArtistService,
  createArtistAlbumService,
};
