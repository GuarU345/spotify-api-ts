import { Request, Response } from "express";
import { artistSchema } from "../schemas/artistSchema";
import { ArtistService } from "../services/ArtistService";

const createNewArtist = async (req: Request, res: Response) => {
  const result = artistSchema.safeParse(req.body);

  if (result.success === false) {
    return res.status(422).json({ message: JSON.parse(result.error.message) });
  }

  const body = result.data;

  try {
    const newArtist = await ArtistService.createArtistService(body);
    res.json(newArtist);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

const getArtists = async (_req, res) => {
  try {
    const artists = await ArtistService.getArtistsService();
    res.json(artists);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

const getArtistById = async (req, res) => {
  const { id } = req.params;
  try {
    const artist = await ArtistService.getArtistByIdService(id);
    res.json(artist);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

export const ArtistController = {
  createNewArtist,
  getArtists,
  getArtistById,
};
