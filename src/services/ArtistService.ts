import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

const getArtistsService = async () => {
  try {
    const artists = await prisma.artist.findMany();
    if (!artists) {
      throw new Error("No se encontraron artistas");
    }
    return artists;
  } catch (error) {
    throw new Error("Error al buscar los artistas");
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
      throw new Error("Artista no encontrado");
    }
    return artist;
  } catch (error) {
    throw new Error("Error al buscar el artista");
  }
};

const createArtistService = async (body) => {
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
    throw new Error("Error al crear el artista");
  }
};

export const ArtistService = {
  getArtistsService,
  getArtistByIdService,
  createArtistService,
};
