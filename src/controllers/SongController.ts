import { NextFunction, Request, Response } from "express";
import { SongService } from "../services/SongService";
import { songSchema } from "../schemas/songSchema";

const createNewSong = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const mp3File = req.file?.buffer;

  if (!mp3File) {
    return res.status(404).json({ message: "archivo de cancion requerido" });
  }

  const result = songSchema.safeParse(req.body);

  if (result.success === false) {
    return res.status(422).json({ error: JSON.parse(result.error.message) });
  }

  const body = {
    ...result.data,
    track: mp3File,
  };

  try {
    const newSong = await SongService.createSong(id, body);
    res.json(newSong);
  } catch (error) {
    next(error);
  }
};

const getSongs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songs = await SongService.getSongs();
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

const getSongById = async (req: Request, res: Response, next: NextFunction) => {
  const { songId } = req.params;
  try {
    const song = await SongService.getSongById(songId);
    return res.json(song);
  } catch (error) {
    next(error);
  }
};

const streamSongById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { songId } = req.params;
  try {
    const stream = await SongService.streamSongById(songId);
    if (stream !== null) {
      stream.pipe(res);
    } else {
      return res.json({ message: "no se pudo realizar el pipe" });
    }
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
  const { userId } = req.params;
  const { songs } = req.body;

  try {
    const likedSongIds = await SongService.getLikedSongsByUserId(userId, songs);
    res.json(likedSongIds);
  } catch (error) {
    next(error);
  }
};

export const SongController = {
  createNewSong,
  getSongsByAlbumId,
  getSongs,
  getSongById,
  streamSongById,
  getLikedSongsByUserId,
};
