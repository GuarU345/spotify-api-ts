import { Song, SongBody } from "../interfaces/interfaces";
import EmptyResponseError from "../middlewares/errors/empty.error";
import GenericPrismaError from "../middlewares/errors/prisma.error";
import { bufferToStream } from "../utils/helpers";
import { prisma } from "../utils/prisma";
import { AlbumService } from "./AlbumService";

const getSongs = async () => {
  try {
    const songs = await prisma.song.findMany();
    return songs;
  } catch (error) {
    throw new GenericPrismaError("Error al tratar de obtener las canciones");
  }
};

const createSong = async (albumId: string, body: SongBody) => {
  const { name, duration, track } = body;
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
        track,
        album_id: albumId,
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

const getSongById = async (songId: string) => {
  try {
    const song = await prisma.song.findUnique({
      where: {
        id: songId,
      },
      include: {
        artist: true,
        album: true,
      },
    });
    if (!song) {
      throw new EmptyResponseError("No se encontro la cancion");
    }
    return song;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al tratar de buscar la cancion");
  }
};

const streamSongById = async (songId: string) => {
  try {
    const song = await prisma.song.findUnique({
      where: {
        id: songId,
      },
    });
    if (!song) {
      throw new EmptyResponseError("No se encontro la cancion");
    }
    const stream = song.track ? bufferToStream(song.track) : null;
    return stream;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al streamear la cancion");
  }
};

const getSongsByAlbumId = async (albumId: string) => {
  try {
    const album = await prisma.album.findUnique({
      include: {
        songs: {
          orderBy: {
            name: "asc",
          },
        },
        artist: true,
        color: true,
      },
      where: {
        id: albumId,
      },
    });

    if (!album) {
      throw new EmptyResponseError("Album no encontrado");
    }

    const songsAlbum = {
      id: album?.id,
      artist: album?.artist.name,
      name: album?.name,
      image: album?.album_image,
      color: album.color?.color,
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

const getLikedSongsByUserId = async (userId: string, songs: Song[]) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new EmptyResponseError("Usuario no encontrado");
    }
    const songIds = songs.map((song) => song.id);
    const searchSongs = await prisma.songLike.findMany({
      where: {
        song_id: {
          in: songIds,
        },
        user_id: user.id,
      },
    });
    const likedSongs = searchSongs.map((likedSong) => likedSong.song_id);
    return likedSongs;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError(
      "Error al tratar de encontrar las canciones con me gusta"
    );
  }
};

const addLikedSongToLikedSongsPlaylist = async (
  playlistId: string,
  songId: string
) => {
  try {
    await prisma.playlistSong.create({
      data: {
        playlist_id: playlistId,
        song_id: songId,
      },
    });
  } catch (error) {
    throw new GenericPrismaError("Error al agregar la cancion gustada");
  }
};

const searchSongsForYourPlaylist = async (name: string) => {
  const searchSongs = await prisma.song.findMany({
    where: {
      name: {
        contains: name,
      },
    },
    include: {
      album: {
        select: {
          name: true,
          album_image: true,
        },
      },
      artist: {
        select: {
          name: true,
        },
      },
    },
  });
  return searchSongs.map((song) => {
    return {
      id: song.id,
      name: song.name,
      album: {
        name: song.album.name,
        image: song.album.album_image,
      },
      artist: {
        name: song.artist?.name,
      },
    };
  });
};

export const SongService = {
  createSong,
  getSongs,
  getSongsByAlbumId,
  getSongById,
  streamSongById,
  getLikedSongsByUserId,
  addLikedSongToLikedSongsPlaylist,
  searchSongsForYourPlaylist,
};
