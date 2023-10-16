import { Request, Response } from "express";
import { SongService } from "../services/SongService";
import { songSchema } from "../schemas/songSchema";

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
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

const getSongByName = async (req: Request, res) => {
  const { name } = req.query;
  try {
    const songWithData = await SongService.searchSongByNameService(name);
    res.json(songWithData);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

const getSongsByAlbum = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const songsAlbum = await SongService.getSongsByAlbumService(id);
    res.json(songsAlbum);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

const getLikedSongsByUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const likedSongs = await SongService.getLikedSongsByUserService(id);
    res.json(likedSongs);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

export const SongController = {
  createNewSong,
  getSongsByAlbum,
  getSongByName,
  getLikedSongsByUser,
};
