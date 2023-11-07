import { Song } from "../interfaces/interfaces";
import EmptyResponseError from "../middlewares/errors/empty.error";
import GenericPrismaError from "../middlewares/errors/prisma.error";
import { prisma } from "../utils/prisma";
import { AlbumService } from "./AlbumService";

const createSong = async (albumId: string, body: Song) => {
  const { name, duration } = body;
  try {
    const albumData = await AlbumService.getAlbumById(albumId);

    if (!albumData) {
      throw new EmptyResponseError(
        "No puedes crear una cancion en un album que no existe"
      );
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
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al crear la cancion");
  }
};

const getAllSongsOrSongByName = async (name: string) => {
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
        artistId: song.artist_id,
        artist: song?.artist?.name,
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

const getSongsByAlbumId = async (albumId: string) => {
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
      artist: album?.artist.name,
      name: album?.name,
      image: album?.album_image,
      songs:
        album.songs.length > 0
          ? album?.songs.map((song) => {
              return {
                id: song.id,
                name: song.name,
                duration: song.duration,
              };
            })
          : [],
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

const getLikedSongsByUserId = async (id: string) => {
  try {
    const searchLikedSongs = await prisma.songLike.findMany({
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
        name: likedSong.name,
        album: {
          id: likedSong.album.id,
          name: likedSong.album.name,
          image: likedSong.album.album_image,
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
  createSong,
  getAllSongsOrSongByName,
  getSongsByAlbumId,
  getLikedSongsByUserId,
};
