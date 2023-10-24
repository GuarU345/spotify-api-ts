import { prisma } from "../utils/prisma";
import EmptyResponseError from "../middlewares/errors/empty.error";
import GenericPrismaError from "../middlewares/errors/prisma.error";
import { Artist } from "../interfaces/interfaces";

const getArtistsService = async () => {
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

const getArtistByIdService = async (id: string) => {
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

const createArtistService = async (body: Artist) => {
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

export const ArtistService = {
  getArtistsService,
  getArtistByIdService,
  createArtistService,
};
