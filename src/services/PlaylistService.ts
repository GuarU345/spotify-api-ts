import { Playlist } from "../interfaces/interfaces";
import EmptyResponseError from "../middlewares/errors/empty.error";
import GenericPrismaError from "../middlewares/errors/prisma.error";
import { prisma } from "../utils/prisma";

const getPlaylistsByUserId = async (id: string) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: {
        user_id: id,
      },
    });
    if (playlists.length === 0) {
      throw new EmptyResponseError(
        "No se encontraron playlists de ese usuario"
      );
    }
    return playlists;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError(
      "Error al encontrar las playlists del usuario"
    );
  }
};

const getSongsByPlaylistId = async (id: string) => {
  try {
    //get specific playlist
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!playlist) {
      throw new EmptyResponseError("No se pudo encontrar la playlist");
    }

    //get info with playlist id
    const playlistData = await prisma.playlistSong.findMany({
      where: {
        playlist_id: playlist.id,
      },
    });

    if (playlistData.length === 0) {
      throw new EmptyResponseError("Playlist vacia");
    }

    //get song ids saved in this playlist
    const songIds = playlistData.map((playlistSong) => playlistSong.song_id);

    //search songs by id iterating the song ids
    const songsInfo = await prisma.song.findMany({
      where: {
        id: {
          in: songIds,
        },
      },
      include: {
        artist: true,
        album: true,
      },
    });

    const playlistSongs = {
      playlist: playlist.name,
      playlistDescription: playlist.description,
      playlistImg: playlist.image,
      songs: songsInfo.map((playlistSong) => {
        return {
          songName: playlistSong.name,
          artistName: playlistSong.artist?.name,
          albumName: playlistSong.album.name,
          albumImage: playlistSong.album.album_image,
        };
      }),
    };
    return playlistSongs;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError(
      "Error al encontrar las canciones de esa playlist"
    );
  }
};

const createUserPlaylist = async (id: string) => {
  try {
    const getPlaylists = await prisma.playlist.findMany();
    const standardPlaylistName = `Playlist N. ${getPlaylists.length + 1}`;
    const createPlaylist = await prisma.playlist.create({
      data: {
        name: standardPlaylistName,
        release_date: new Date().toISOString(),
        user_id: id,
        image: "not image",
      },
    });
    return createPlaylist;
  } catch (error) {
    console.error(error);
    throw new GenericPrismaError("No se pudo crear la playlist");
  }
};

const updatePlaylist = async (id: string, userId: string, body: Playlist) => {
  try {
    const { name, description, image } = body;
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!playlist) {
      throw new EmptyResponseError("No se pudo encontrar la playlist");
    }
    const updatePlaylist = await prisma.playlist.update({
      data: {
        name,
        description,
        image,
      },
      where: {
        id: playlist.id,
        user_id: userId,
      },
    });
    return updatePlaylist;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al tratar de actualizar la playlist");
  }
};

const addSongToPlaylist = async (playlistId: string, songId: string) => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: Number(playlistId),
      },
    });
    if (!playlist) {
      throw new EmptyResponseError("No se pudo encontrar la playlist");
    }
    const song = await prisma.song.findUnique({
      where: {
        id: Number(songId),
      },
    });
    if (!song) {
      throw new EmptyResponseError("No se pudo encontrar la cancion");
    }
    const addSong = await prisma.playlistSong.create({
      data: {
        playlist_id: playlist.id,
        song_id: song.id,
      },
    });
    return addSong;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError(
      "Error al tratar de añadir la cancion a la playlist"
    );
  }
};

const removeSongOnPlaylist = async (playlistId: string, songId: string) => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: Number(playlistId),
      },
    });

    if (!playlist) {
      throw new EmptyResponseError("No se pudo encontrar la playlist");
    }

    const song = await prisma.song.findUnique({
      where: {
        id: Number(songId),
      },
    });

    if (!song) {
      throw new EmptyResponseError("No se pudo encontrar la cancion");
    }

    const playlistSong = await prisma.playlistSong.findFirst({
      where: {
        AND: [{ playlist_id: playlist.id }, { song_id: song.id }],
      },
    });

    if (!playlistSong) {
      throw new EmptyResponseError("No se encontro la cancion en esa playlist");
    }

    const removeSong = await prisma.playlistSong.delete({
      where: {
        id: playlistSong.id,
      },
    });

    return removeSong;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError(
      "Error al tratar de eliminar la cancion de la playlist"
    );
  }
};

const countSongsByPlaylistId = async (id: string) => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        playlist_songs: true,
      },
    });
    if (!playlist) {
      throw new EmptyResponseError("No se pudo encontrar la playlist");
    }
    return {
      count: playlist.playlist_songs.length,
    };
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al realizar la consulta");
  }
};

const checkUserHaveLikedSongsPlaylist = async (userId: string) => {
  try {
    const userHaveLikedSongs = await prisma.songLike.findFirst({
      where: {
        user_id: userId,
      },
    });
    return userHaveLikedSongs;
  } catch (error) {
    throw new GenericPrismaError("Error al realizar esta accion");
  }
};

const createUserLikedSongsPlaylist = async (userId: string) => {
  try {
    const createPlaylist = await prisma.playlist.create({
      data: {
        name: "Canciones que te gustan",
        user_id: userId,
        release_date: new Date().toISOString(),
        image: "https://misc.scdn.co/liked-songs/liked-songs-300.png",
      },
    });
    return createPlaylist;
  } catch (error) {
    throw new GenericPrismaError("Error al crear la playlist");
  }
};

export const PlaylistService = {
  getPlaylistsByUserId,
  addSongToPlaylist,
  updatePlaylist,
  countSongsByPlaylistId,
  createUserPlaylist,
  getSongsByPlaylistId,
  removeSongOnPlaylist,
  createUserLikedSongsPlaylist,
  checkUserHaveLikedSongsPlaylist,
};
