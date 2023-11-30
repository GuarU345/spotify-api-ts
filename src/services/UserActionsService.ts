import EmptyResponseError from "../middlewares/errors/empty.error";
import { prisma } from "../utils/prisma";
import GenericPrismaError from "../middlewares/errors/prisma.error";
import { PlaylistService } from "./PlaylistService";
import { SongService } from "./SongService";

const likeSong = async (userId: string, songId: string) => {
  let createLikedSongsPl;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new EmptyResponseError("Usuario no existente");
    }

    const userHaveLikedSongs =
      await PlaylistService.checkUserHaveLikedSongsPlaylist(user.id);

    if (!userHaveLikedSongs) {
      createLikedSongsPl = await PlaylistService.createUserLikedSongsPlaylist(
        user.id
      );
    } else {
      const likedSongsPl = await PlaylistService.getLikedSongsPlaylist(user.id);
      createLikedSongsPl = likedSongsPl;
    }

    const likeSong = await prisma.songLike.create({
      data: {
        user_id: user.id,
        song_id: Number(songId),
      },
    });

    if (createLikedSongsPl) {
      await SongService.addLikedSongToLikedSongsPlaylist(
        createLikedSongsPl.id,
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
        AND: [{ user_id: user.id }, { song_id: Number(songId) }],
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
        id: Number(albumId),
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
        AND: [{ user_id: user.id }, { album_id: Number(albumId) }],
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
        id: Number(artistId),
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
        AND: [{ user_id: user.id }, { artist_id: Number(artistId) }],
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

export const UserActionsService = {
  likeSong,
  dislikeSong,
  likeAlbum,
  dislikeAlbum,
  followArtist,
  unfollowArtist,
};
