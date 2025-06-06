import { Album } from "../interfaces/interfaces";
import EmptyResponseError from "../middlewares/errors/empty.error";
import GenericPrismaError from "../middlewares/errors/prisma.error";
import { prisma } from "../utils/prisma";
import { UserService } from "./UserService";

// Crea un nuevo álbum para un artista dado.
const createArtistAlbum = async (artistId: string, body: Album) => {
  const { name, release_date, album_image } = body;
  try {
    const newAlbum = await prisma.album.create({
      data: {
        name,
        release_date,
        album_image,
        artist_id: artistId,
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
        id: albumId,
      },
      include: {
        color: true,
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
        color: true,
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
        id: artistId,
      },
    });

    if (!artist) {
      throw new EmptyResponseError("Artista no encontrado");
    }

    const artistAlbums = {
      artist: artist?.name,
      album:
        artist.albums.length > 0
          ? artist?.albums.map((album) => {
            return {
              id: album.id,
              name: album.name,
              releaseDate: album.release_date,
            };
          })
          : [],
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
    const user = await UserService.userExists(userId)

    const searchLikedAlbums = await prisma.albumLike.findMany({
      where: {
        user_id: user.id,
      },
    });
    if (searchLikedAlbums.length === 0) {
      return searchLikedAlbums;
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
        name: likedAlbum.name,
        image: likedAlbum.album_image,
        author: likedAlbum.artist.name,
        type: "album",
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

const checkUserLikesAlbum = async (userId: string, albumId: string) => {
  try {
    const user = await UserService.userExists(userId);
    
    const check = await prisma.albumLike.findFirst({
      where: {
        AND: [{ user_id: user.id }, { album_id: albumId }],
      },
    });
    if (!check) {
      return false;
    }
    return true;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.log(error);
    throw new GenericPrismaError("Error al intentar encontrar el registro");
  }
};

export const AlbumService = {
  getAlbums,
  getAlbumById,
  getAlbumsByArtistId,
  createArtistAlbum,
  getLikedAlbumsByUserId,
  checkUserLikesAlbum,
};
