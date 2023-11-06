import { Album } from "../interfaces/interfaces";
import EmptyResponseError from "../middlewares/errors/empty.error";
import GenericPrismaError from "../middlewares/errors/prisma.error";
import { prisma } from "../utils/prisma";

// Crea un nuevo álbum para un artista dado.
const createArtistAlbum = async (
  artistId: string,
  body: Album,
  album_image: string
) => {
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
    console.error(error);
    throw new GenericPrismaError("Error al crear un nuevo album");
  }
};

//Obtiene un album por su id
const getAlbumById = async (albumId: string) => {
  try {
    const album = await prisma.album.findUnique({
      where: {
        id: Number(albumId),
      },
    });
    if (!album) {
      throw new EmptyResponseError("No se pudo encontrar el album");
    }
    return album;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al buscar el album");
  }
};

// Obtiene todos los álbumes con información detallada del artista.
const getAlbums = async () => {
  try {
    const albums = await prisma.album.findMany({
      include: {
        artist: true,
      },
    });
    if (!albums) {
      throw new EmptyResponseError("No se encontraron albums");
    }
    return albums;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al traer los albums");
  }
};

// Obtiene todos los álbumes de un artista por su ID.
const getAlbumsByArtistId = async (artistId: string) => {
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
      throw new EmptyResponseError("Artista no encontrado");
    }

    const artistAlbums = {
      artist: artist?.name,
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
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al traer los albums del artista");
  }
};

const getLikedAlbumsByUserId = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new EmptyResponseError("Usuario no existente");
    }
    const searchLikedAlbums = await prisma.albumLike.findMany({
      where: {
        user_id: user.id,
      },
    });
    if (searchLikedAlbums.length === 0) {
      throw new EmptyResponseError("No tienes albums con me gusta");
    }

    const likedAlbumIds = searchLikedAlbums.map(
      (likedAlbum) => likedAlbum.album_id
    );

    const likedAlbumsData = await prisma.album.findMany({
      where: {
        id: {
          in: likedAlbumIds,
        },
      },
      include: {
        artist: true,
      },
    });

    const likedAlbums = likedAlbumsData.map((likedAlbum) => {
      return {
        id: likedAlbum.id,
        album: likedAlbum.name,
        albumImage: likedAlbum.album_image,
        artist: likedAlbum.artist.name,
      };
    });

    return likedAlbums;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.log(error);
    throw new GenericPrismaError("Error al buscar los albums");
  }
};

export const AlbumService = {
  getAlbums,
  getAlbumById,
  getAlbumsByArtistId,
  createArtistAlbum,
  getLikedAlbumsByUserId,
};
