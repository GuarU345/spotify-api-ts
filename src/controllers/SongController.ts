import { Request, Response } from "express";
import { SongService } from "../services/SongService";
import { songSchema } from "../schemas/songSchema";
import EmptyResponseError from "../middlewares/errors/errors";
import GenericPrismaError from "../middlewares/errors/prisma.errors";

const createNewSong = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = songSchema.safeParse(req.body);

  if (result.success === false) {
    return res.status(422).json({ error: JSON.parse(result.error.message) });
  }

  const body = result.data;

  try {
    const newSong = await SongService.createSongService(id, body);
    res.json(newSong);
  } catch (error) {
    if (error instanceof GenericPrismaError) {
      return res.status(404).json({ error: error.message });
    }
  }
};

const getSongs = async (req: Request, res) => {
  const { name } = req.query;
  try {
    const songWithData = await SongService.getAllSongsOrSongByNameService(name);
    res.json(songWithData);
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      return res.json({ message: error.message });
    }
    if (error instanceof GenericPrismaError) {
      return res.status(404).json({ error: error.message });
    }
  }
};

const getSongsByAlbum = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const songsAlbum = await SongService.getSongsByAlbumService(id);
    return res.json(songsAlbum);
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      return res.json({ message: error.message });
    }
    if (error instanceof GenericPrismaError) {
      return res.status(404).json({ error: error.message });
    }
  }
};

const getLikedSongsByUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const likedSongs = await SongService.getLikedSongsByUserService(id);
    res.json(likedSongs);
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      return res.json({ message: error.message });
    }
    if (error instanceof GenericPrismaError) {
      return res.status(404).json({ error: error.message });
    }
  }
};

export const SongController = {
  createNewSong,
  getSongsByAlbum,
  getSongs,
  getLikedSongsByUser,
};
