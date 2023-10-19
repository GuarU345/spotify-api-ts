import EmptyResponseError from "../middlewares/errors/errors";
import GenericPrismaError from "../middlewares/errors/prisma.errors";
import { prisma } from "../utils/prisma";
import { AlbumService } from "./AlbumService";

const createSongService = async (albumId, body) => {
  const { name, duration } = body;
  try {
    const albumData = await AlbumService.getAlbumByIdService(albumId);

    if (!albumData) {
      throw new Error("No puedes crear una cancion en un album que no existe");
    }

    const newSong = await prisma.song.create({
      data: {
        name,
        duration,
        album_id: Number(albumId),
        artist_id: albumData?.artist_id,
      },
    });
    return newSong;
  } catch (error) {
    console.error(error);
    throw new GenericPrismaError("Error al crear la cancion");
  }
};

const getAllSongsOrSongByNameService = async (name) => {
  try {
    const songs = await prisma.song.findMany({
      include: {
        artist: true,
        album: true,
      },
      where: {
        name: {
          contains: name as string,
        },
      },
    });

    if (songs.length < 1) {
      throw new Error("Ninguna cancion coincide con la busqueda");
    }

    const songsWithData = songs.map((song) => {
      return {
        authorId: song.artist_id,
        authorName: song?.artist?.name,
        album: {
          albumId: song?.album.id,
          albumName: song.album.name,
          albumImage: song?.album.album_image,
        },
        song: {
          songId: song.id,
          songName: song?.name,
        },
      };
    });

    return songsWithData;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al tratar de realizar la busqueda");
  }
};

const getSongsByAlbumService = async (albumId) => {
  try {
    const album = await prisma.album.findUnique({
      include: {
        songs: true,
        artist: true,
      },
      where: {
        id: Number(albumId),
      },
    });

    if (!album) {
      throw new EmptyResponseError("Album no encontrado");
    }

    const songsAlbum = {
      author: album?.artist.name,
      album: album?.name,
      songs:
        album.songs.length > 0
          ? album?.songs.map((song) => {
              return {
                id: song.id,
                songName: song.name,
              };
            })
          : "No se encontraron canciones",
    };
    return songsAlbum;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al tratar de encontrar las canciones");
  }
};

const getLikedSongsByUserService = async (id: string) => {
  try {
    const searchLikedSongs = await prisma.like.findMany({
      where: {
        user_id: id,
      },
    });
    if (searchLikedSongs.length === 0) {
      throw new EmptyResponseError("No tienes canciones con me gusta");
    }
    const likedSongIds = searchLikedSongs.map((likedSong) => likedSong.song_id);

    const likedSongsData = await prisma.song.findMany({
      where: {
        id: {
          in: likedSongIds,
        },
      },
      include: {
        artist: true,
        album: true,
      },
    });

    const likedSongs = likedSongsData.map((likedSong) => {
      return {
        id: likedSong.id,
        artist: likedSong.artist?.name,
        song: likedSong.name,
        album: {
          albumId: likedSong.album.id,
          albumName: likedSong.album.name,
          albumImage: likedSong.album.album_image,
        },
      };
    });

    return likedSongs;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al tratar de encontrar las canciones");
  }
};

export const SongService = {
  createSongService,
  getAllSongsOrSongByNameService,
  getSongsByAlbumService,
  getLikedSongsByUserService,
};
