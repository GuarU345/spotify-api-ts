import { Request, Response, NextFunction } from "express";
import { artistSchema } from "../schemas/artistSchema";
import { ArtistService } from "../services/ArtistService";

const createNewArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = artistSchema.safeParse(req.body);

  if (result.success === false) {
    return res.status(422).json({ message: JSON.parse(result.error.message) });
  }

  const body = result.data;

  try {
    const newArtist = await ArtistService.createArtistService(body);
    res.json(newArtist);
  } catch (error) {
    next(error);
  }
};

const getArtists = async (_req, res: Response, next: NextFunction) => {
  try {
    const artists = await ArtistService.getArtistsService();
    res.json(artists);
  } catch (error) {
    next(error);
  }
};

const getArtistById = async (req, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const artist = await ArtistService.getArtistByIdService(id);
    res.json(artist);
  } catch (error) {
    next(error);
  }
};

export const ArtistController = {
  createNewArtist,
  getArtists,
  getArtistById,
};
