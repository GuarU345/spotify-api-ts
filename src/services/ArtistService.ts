import { prisma } from "../utils/prisma";
import EmptyResponseError from "../middlewares/errors/empty.error";
import GenericPrismaError from "../middlewares/errors/prisma.error";
import { Artist } from "../interfaces/interfaces";

const getArtists = async () => {
  try {
    const artists = await prisma.artist.findMany();
    if (!artists) {
      throw new EmptyResponseError("No se encontraron artistas");
    }
    return artists;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al buscar los artistas");
  }
};

const getArtistById = async (id: string) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!artist) {
      throw new EmptyResponseError("Artista no encontrado");
    }
    return artist;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al buscar el artista");
  }
};

const createArtist = async (body: Artist) => {
  const { name, nationality } = body;
  try {
    const newArtist = await prisma.artist.create({
      data: {
        name,
        nationality,
      },
    });
    return newArtist;
  } catch (error) {
    console.error(error);
    throw new GenericPrismaError("Error al crear el artista");
  }
};

const getFollowedArtistsByUserId = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new EmptyResponseError("Usuario no existente");
    }
    const searchFollowedArtists = await prisma.artistFollow.findMany({
      where: {
        user_id: user.id,
      },
    });
    if (searchFollowedArtists.length === 0) {
      throw new EmptyResponseError("No sigues a ningun artista");
    }
    const followedArtistsIds = searchFollowedArtists.map(
      (followed) => followed.id
    );
    const followedArtistsData = await prisma.artist.findMany({
      where: {
        id: {
          in: followedArtistsIds,
        },
      },
    });

    const followedArtists = followedArtistsData.map((followed) => {
      return {
        id: followed.id,
        name: followed.name,
      };
    });
    return followedArtists;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      throw error;
    }
    console.error(error);
    throw new GenericPrismaError("Error al buscar los artistas que sigues");
  }
};

export const ArtistService = {
  getArtists,
  getArtistById,
  createArtist,
  getFollowedArtistsByUserId,
};
