import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import EmptyResponseError from "../middlewares/errors/errors";
import { prisma } from "../utils/prisma";

const likeSongService = async (userId: string, songId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new EmptyResponseError("Usuario no existente");
    }
    const likeSong = await prisma.like.create({
      data: {
        user_id: user.id,
        song_id: Number(songId),
      },
    });
    return likeSong;
  } catch (error) {
    console.error(error);
    throw new Error("No se pudo agregar la cancion en tus me gusta");
  }
};

const dislikeSongService = async (userId: string, songId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new EmptyResponseError("Usuario no existente");
    }
    const searchUserSong = await prisma.like.findFirst({
      where: {
        AND: [{ user_id: user.id }, { song_id: Number(songId) }],
      },
    });
    if (!searchUserSong) {
      throw new EmptyResponseError("Registro no existente");
    }

    const dislikeSong = await prisma.like.delete({
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
    throw new Error("Error al intentar eliminar el registro");
  }
};

export const UserActionsService = {
  likeSongService,
  dislikeSongService,
};
