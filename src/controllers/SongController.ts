import { NextFunction, Request, Response } from "express";
import { SongService } from "../services/SongService";
import { songSchema } from "../schemas/songSchema";

const createNewSong = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const result = songSchema.safeParse(req.body);

  if (result.success === false) {
    return res.status(422).json({ error: JSON.parse(result.error.message) });
  }

  const body = result.data;

  try {
    const newSong = await SongService.createSong(id, body);
    res.json(newSong);
  } catch (error) {
    next(error);
  }
};

const getSongs = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.query;
  try {
    const songWithData = await SongService.getAllSongsOrSongByName(
      name as string
    );
    res.json(songWithData);
  } catch (error) {
    next(error);
  }
};

const getSongsByAlbumId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const songsAlbum = await SongService.getSongsByAlbumId(id);
    return res.json(songsAlbum);
  } catch (error) {
    next(error);
  }
};

const getLikedSongsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const likedSongs = await SongService.getLikedSongsByUserId(id);
    res.json(likedSongs);
  } catch (error) {
    next(error);
  }
};

export const SongController = {
  createNewSong,
  getSongsByAlbumId,
  getSongs,
  getLikedSongsByUserId,
};
