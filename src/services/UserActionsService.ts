import EmptyResponseError from "../middlewares/errors/empty.error";
import { prisma } from "../utils/prisma";
import GenericPrismaError from "../middlewares/errors/prisma.error";
import { PlaylistService } from "./PlaylistService";
import { SongService } from "./SongService";
import { MUSIC_TYPES } from "../utils/helpers";

const likeSong = async (userId: string, songId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new EmptyResponseError("Usuario no existente");
    }

    const likeSong = await prisma.songLike.create({
      data: {
        user_id: user.id,
        song_id: songId,
      },
    });

    const likedSongsPlaylist = await PlaylistService.getLikedSongsPlaylist(
      user.id
    );

    if (likedSongsPlaylist) {
      await SongService.addLikedSongToLikedSongsPlaylist(
        likedSongsPlaylist.id,
        songId
      );
    }

    return likeSong;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError(
      "No se pudo agregar la cancion en tus me gusta"
    );
  }
};

const dislikeSong = async (userId: string, songId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new EmptyResponseError("Usuario no existente");
    }
    const searchUserSong = await prisma.songLike.findFirst({
      where: {
        AND: [{ user_id: user.id }, { song_id: songId }],
      },
    });
    if (!searchUserSong) {
      throw new EmptyResponseError("Registro no existente");
    }
    const searchLikedSongsPl = await PlaylistService.getLikedSongsPlaylist(
      user.id
    );

    if (!searchLikedSongsPl) {
      throw new EmptyResponseError("No se encontro la playlist");
    }

    await PlaylistService.removeSongOnPlaylist(searchLikedSongsPl?.id, songId);

    const dislikeSong = await prisma.songLike.delete({
      where: {
        id: searchUserSong.id,
      },
    });
    return dislikeSong;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al intentar eliminar el registro");
  }
};

const likeAlbum = async (userId: string, albumId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new EmptyResponseError("Usuario no existente");
    }
    const album = await prisma.album.findUnique({
      where: {
        id: albumId,
      },
    });
    if (!album) {
      throw new EmptyResponseError("Album no existente");
    }
    const likeAlbum = await prisma.albumLike.create({
      data: {
        user_id: user.id,
        album_id: album.id,
      },
    });
    return likeAlbum;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("No se pudo agregar el album en tus me gusta");
  }
};

const dislikeAlbum = async (userId: string, albumId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new EmptyResponseError("Usuario no existente");
    }
    const searchUserAlbum = await prisma.albumLike.findFirst({
      where: {
        AND: [{ user_id: user.id }, { album_id: albumId }],
      },
    });
    if (!searchUserAlbum) {
      throw new EmptyResponseError("Registro no existente");
    }
    const dislikeAlbum = await prisma.albumLike.delete({
      where: {
        id: searchUserAlbum.id,
      },
    });
    return dislikeAlbum;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al intentar eliminar el registro");
  }
};

const followArtist = async (userId: string, artistId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new EmptyResponseError("Usuario no existente");
    }
    const artist = await prisma.artist.findUnique({
      where: {
        id: artistId,
      },
    });
    if (!artist) {
      throw new EmptyResponseError("Artista no encontrado");
    }
    const follow = await prisma.artistFollow.create({
      data: {
        user_id: user.id,
        artist_id: artist.id,
      },
    });
    return follow;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("No se pudo agregar a tus seguidos");
  }
};

const unfollowArtist = async (userId: string, artistId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new EmptyResponseError("Usuario no existente");
    }
    const searchArtistFollow = await prisma.artistFollow.findFirst({
      where: {
        AND: [{ user_id: user.id }, { artist_id: artistId }],
      },
    });
    if (!searchArtistFollow) {
      throw new EmptyResponseError("Registro no existente");
    }
    const unfollow = await prisma.artistFollow.delete({
      where: {
        id: searchArtistFollow.id,
      },
    });
    return unfollow;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al intentar eliminar el registro");
  }
};

const globalSearch = async (name: string) => {
  try {
    const songs = await prisma.song.findMany({
      include: {
        artist: {
          select: {
            name: true
          }
        },
        album: {
          select: {
            name: true,
            album_image: true
          }
        },
      },
      where: {
        name: {
          contains: name as string,
        },
      },
    });

    const songsData = songs.map(song => {
      return {
        id: song.id,
        name: song.name,
        artist: song.artist?.name,
        image: song.album.album_image,
        type: "song"
      }
    })

    const albums = await prisma.album.findMany({
      include: {
        artist: {
          select: {
            name: true
          }
        },
      },
      where: {
        name: {
          contains: name,
        },
      },
    });

    const albumsData = albums.map(album => {
      return {
        id: album.id,
        name: album.name,
        artist: album.artist.name,
        image: album.album_image,
        type: "album"
      }
    })

    return [...songsData, ...albumsData]
  } catch (error) {
    throw new GenericPrismaError("Error al tratar de hacer una busqueda");
  }
};

const userReproducingSomething = async (id: string, type: string) => {
  try {
    if (type === MUSIC_TYPES.ALBUM) {
      const album = await prisma.album.findUnique({
        where: {
          id,
        },
        include: {
          songs: {
            orderBy: {
              name: "asc",
            },
          },
          artist: true,
        },
      });
      if (!album) {
        throw new EmptyResponseError("No se encontro el album");
      }
      return {
        id: album.id,
        type,
        songId: album.songs[0].id,
        songs: album.songs.map((song) => {
          return {
            id: song.id,
            name: song.name,
            album: {
              name: album.name,
              image: album.album_image,
            },
            artist: {
              name: album.artist.name,
            },
          };
        }),
      };
    }
    if (type === MUSIC_TYPES.PLAYLIST) {
      const playlist = await prisma.playlist.findUnique({
        where: {
          id,
        },
      });
      if (!playlist) {
        throw new EmptyResponseError("No se encontro la playlist");
      }
      const playlistSongs = await prisma.playlistSong.findMany({
        where: {
          playlist_id: playlist.id,
        },
      });
      const songIds = playlistSongs.map((playlistSong) => playlistSong.song_id);
      const songs = await prisma.song.findMany({
        where: {
          id: {
            in: songIds,
          },
        },
        include: {
          album: true,
          artist: true,
        },
      });

      if (songs.length === 0) {
        throw new EmptyResponseError("La playlist no cuenta con canciones");
      }

      return {
        id: playlist.id,
        type,
        songId: songs[0].id,
        songs: songs.map((song) => {
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
        }),
      };
    }
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al tratar de encontrar la informacion");
  }
};

export const UserActionsService = {
  likeSong,
  dislikeSong,
  likeAlbum,
  dislikeAlbum,
  followArtist,
  unfollowArtist,
  globalSearch,
  userReproducingSomething,
};
