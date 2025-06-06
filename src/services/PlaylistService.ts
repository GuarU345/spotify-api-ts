import { Playlist } from "../interfaces/interfaces";
import EmptyResponseError from "../middlewares/errors/empty.error";
import GenericPrismaError from "../middlewares/errors/prisma.error";
import { INITIAL_PLAYLIST_NAME } from "../utils/helpers";
import { prisma } from "../utils/prisma";
import { SongService } from "./SongService";
import { UserService } from "./UserService";

const getPlaylistsByUserId = async (id: string) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: {
        user_id: id,
      },
      include: {
        user: true,
      },
      orderBy: {
        release_date: 'asc'
      }
    });
    if (playlists.length === 0) return []
    const playlistsData = playlists.map(async (playlist) => {
      return {
        id: playlist.id,
        name: playlist.name,
        image: playlist.image,
        author: playlist.user.username,
        type: "playlist",
        haveSongs: await checkPlaylistHaveSongs(playlist.id)
      };
    });
    return await Promise.all(playlistsData)
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

const getPlaylistsCountByUserId = async (id: string) => {
  try {
    const user = await UserService.userExists(id)
    const playlists = await prisma.playlist.findMany({
      where: {
        user_id: user.id,
        NOT: {
          name: INITIAL_PLAYLIST_NAME
        }
      },
      include: {
        playlist_songs: true
      }
    })

    const playlistsWithSongs = playlists.filter(playlist => playlist.playlist_songs.length > 0)
    return playlistsWithSongs.length
  } catch (error) {
    throw new GenericPrismaError("Error al tratar de traer el total de playlists")
  }
}

const createUserPlaylist = async (id: string) => {
  try {
    const userPlaylists = await checkUserHavePlaylists(id);
    const userPlaylistsName = userPlaylists.filter(
      (userPlaylist) => userPlaylist.name === "Playlist N. 1"
    );
    const standardPlaylistName =
      userPlaylistsName.length < 0
        ? "Playlist N. 1"
        : `Playlist N. ${userPlaylists.length}`;
    const createPlaylist = await prisma.playlist.create({
      data: {
        name: standardPlaylistName,
        release_date: new Date().toISOString(),
        user_id: id,
        image:
          "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2",
      },
    });
    return createPlaylist;
  } catch (error) {
    console.error(error);
    throw new GenericPrismaError("No se pudo crear la playlist");
  }
};

const getPlaylistById = async (id: string) => {
  const playlist = await prisma.playlist.findUnique({
    where: {
      id
    }
  })
  if (!playlist) {
    throw new EmptyResponseError("No se pudo encontrar la playlist")
  }
  return playlist
}

const updatePlaylist = async (id: string, body: Playlist) => {
  try {
    const { name, description, image } = body;
    const playlist = await getPlaylistById(id)

    const updatePlaylist = await prisma.playlist.update({
      data: {
        name,
        description,
        image,
      },
      where: {
        id: playlist.id,
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

const deletePlaylist = async (id: string) => {
  try {
    const playlist = await getPlaylistById(id)

    const remove = await prisma.playlist.delete({
      where: {
        id:playlist.id
      }
    })
    return remove
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al tratar de eliminar la playlist");
  }
}

const addSongToPlaylist = async (playlistId: string, songId: string) => {
  try {
    const playlist = await getPlaylistById(playlistId)
    const song = await SongService.getSongById(songId)

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
    const playlist = await getPlaylistById(playlistId)
    const song = await SongService.getSongById(songId)

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
        id: id,
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

const getLikedSongsPlaylist = async (userId: string) => {
  try {
    const user = await UserService.userExists(userId)
    
    const likedPlaylist = await prisma.playlist.findFirst({
      where: {
        AND: [
          {
            name: INITIAL_PLAYLIST_NAME,
          },
          {
            user_id: user.id,
          },
        ],
      },
    });
    return likedPlaylist;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al traer la playlist");
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
    const IsCreated = await getLikedSongsPlaylist(userId);
    if (IsCreated) {
      return IsCreated;
    }
    const createPlaylist = await prisma.playlist.create({
      data: {
        name: INITIAL_PLAYLIST_NAME,
        user_id: userId,
        release_date: new Date().toISOString(),
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmzWWypc2RrvdQhLmIbXa0zEfS-zA5xVogGg&s",
      },
    });
    return createPlaylist;
  } catch (error) {
    throw new GenericPrismaError("Error al crear la playlist");
  }
};

const checkUserHavePlaylists = async (userId: string) => {
  const findPlaylist = await prisma.playlist.findMany({
    where: {
      user_id: userId,
    },
  });
  return findPlaylist;
};

const checkPlaylistHaveSongs = async (playlistId: string) => {
  const haveSong = await prisma.playlistSong.findFirst({
    where: {
      playlist_id: playlistId
    }
  })
  if (!haveSong?.song_id) {
    return false
  }
  return true
}

export const PlaylistService = {
  getPlaylistsByUserId,
  getPlaylistsCountByUserId,
  addSongToPlaylist,
  updatePlaylist,
  countSongsByPlaylistId,
  createUserPlaylist,
  removeSongOnPlaylist,
  createUserLikedSongsPlaylist,
  checkUserHaveLikedSongsPlaylist,
  getLikedSongsPlaylist,
  deletePlaylist,
  getPlaylistById
};
