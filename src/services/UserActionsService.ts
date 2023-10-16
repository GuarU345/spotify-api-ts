import { prisma } from "../utils/prisma";

const likeSongService = async (userId: string, songId: string) => {
  try {
    const likeSong = await prisma.like.create({
      data: {
        user_id: userId,
        song_id: Number(songId),
      },
    });
    return likeSong;
  } catch (error) {
    throw new Error("No se pudo agregar la cancion en tus me gusta");
  }
};

const dislikeSongService = async (userId: string, songId: string) => {
  try {
    const searchUserSong = await prisma.like.findFirst({
      where: {
        user_id: userId,
        song_id: Number(songId),
      },
    });

    if (!searchUserSong) {
      throw new Error("Registro no existente");
    }

    const dislikeSong = await prisma.like.delete({
      where: {
        id: searchUserSong.id,
      },
    });
    return dislikeSong;
  } catch (error) {
    throw new Error("Error al intentar eliminar el registro");
  }
};

export const UserActionsService = {
  likeSongService,
  dislikeSongService,
};
