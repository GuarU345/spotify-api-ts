import {
  AlbumSong,
  PlaylistSong,
  Song,
  SongBody,
} from "../interfaces/interfaces";
import EmptyResponseError from "../middlewares/errors/empty.error";
import GenericPrismaError from "../middlewares/errors/prisma.error";
import { prisma } from "../utils/prisma";
import { AlbumService } from "./AlbumService";
import { PlaylistService } from "./PlaylistService";
import { UserService } from "./UserService";

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

const getSongsByAlbumId = async (albumId: string, userId?: string) => {
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

    if (userId) {
      const userLikedSongs = await checkWhatAlbumSongsLikesUser(
        userId,
        album.songs
      );
      const songsAlbum = {
        id: album?.id,
        artist: album?.artist.name,
        name: album?.name,
        image: album?.album_image,
        color: album.color?.color,
        songs: userLikedSongs,
      };
      return songsAlbum;
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

const getSongsByPlaylistId = async (id: string, userId?: string) => {
  try {
    //get specific playlist
    const playlist = await PlaylistService.getPlaylistById(id)
    //get info with playlist id
    const playlistData = await prisma.playlistSong.findMany({
      where: {
        playlist_id: playlist.id,
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    if (playlistData.length === 0) {
      return playlist;
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

    if (userId) {
      const userLikedSongs = await checkWhatPlaylistSongsLikesUser(
        userId,
        songsInfo
      );
      const playlistSongs = {
        name: playlist.name,
        description: playlist.description,
        image: playlist.image,
        songs: userLikedSongs,
      };
      return playlistSongs;
    }

    const playlistSongs = {
      name: playlist.name,
      description: playlist.description,
      image: playlist.image,
      songs:
        songsInfo.length > 0
          ? songsInfo.map((playlistSong) => {
            return {
              album: {
                id: playlistSong.album.id,
                name: playlistSong.album.name,
                image: playlistSong.album.album_image,
              },
              song: {
                id: playlistSong.id,
                name: playlistSong.name,
                duration: playlistSong.duration,
              },
              artist: {
                name: playlistSong.artist?.name,
              },
            };
          })
          : [],
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

const getLikedSongsByUserId = async (userId: string, songs: Song[]) => {
  try {
    const user = await UserService.userExists(userId)
    
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

const checkWhatAlbumSongsLikesUser = async (
  userId: string,
  albumSongs: AlbumSong[]
) => {
  const user = await UserService.userExists(userId);

  const songIds = albumSongs.map((song) => song.id);

  const likedSongIds = await getLikedSongIds(songIds, user);

  return albumSongs.map((song) => {
    return {
      id: song.id,
      name: song.name,
      duration: song.duration,
      liked: likedSongIds.includes(song.id) ? true : false,
    };
  });
};

const checkWhatPlaylistSongsLikesUser = async (
  userId: string,
  playlistSongs: PlaylistSong[]
) => {
  const user = await UserService.userExists(userId);

  const songIds = playlistSongs.map((song) => song.id);

  const likedSongIds = await getLikedSongIds(songIds, user);

  return playlistSongs.map((playlistSong) => {
    return {
      album: {
        id: playlistSong.album?.id,
        name: playlistSong.album?.name,
        image: playlistSong.album?.album_image,
      },
      song: {
        id: playlistSong.id,
        name: playlistSong.name,
        duration: playlistSong.duration,
        liked: likedSongIds.includes(playlistSong.id) ? true : false,
      },
      artist: {
        name: playlistSong.artist?.name,
      },
    };
  });
};

const getLikedSongIds = async (songIds: string[], user: { id: string }) => {
  try {
    const likedSongs = await prisma.songLike.findMany({
      where: {
        AND: [{ song_id: { in: songIds } }, { user_id: user.id }],
      }
    });

    const likedSongIds = likedSongs.map((likedSong) => likedSong.song_id);
    return likedSongIds;
  } catch (error) {
    console.error(error);
    throw new GenericPrismaError(
      "Error al tratar de encontrar los ids de las canciones"
    );
  }
};

export const SongService = {
  createSong,
  getSongs,
  getSongsByAlbumId,
  getSongsByPlaylistId,
  getSongById,
  getLikedSongsByUserId,
  addLikedSongToLikedSongsPlaylist,
  searchSongsForYourPlaylist,
};
