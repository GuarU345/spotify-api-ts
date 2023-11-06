import { Request, Response, NextFunction } from "express";
import { artistSchema } from "../schemas/artistSchema";
import { ArtistService } from "../services/ArtistService";
import { Artist } from "../interfaces/interfaces";

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
    const newArtist = await ArtistService.createArtist(body);
    res.json(newArtist);
  } catch (error) {
    next(error);
  }
};

const getArtists = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const artists = await ArtistService.getArtists();
    res.json(artists);
  } catch (error) {
    next(error);
  }
};

const getArtistById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const artist = await ArtistService.getArtistById(id);
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
