import { Request, Response, NextFunction } from "express";
import { PlaylistService } from "../services/PlaylistService";
import { playlistUpdateSchema } from "../schemas/playlistSchema";
import { readFile } from "fs/promises";
import { Playlist } from "../interfaces/interfaces";

const getPlaylistsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const playlists = await PlaylistService.getPlaylistsByUserId(id);
    return res.json(playlists);
  } catch (error) {
    next(error);
  }
};

const getSongsByPlaylistId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const resp = await PlaylistService.getSongsByPlaylistId(id);
    return res.json(resp);
  } catch (error) {
    next(error);
  }
};

const createUserPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const newPlayslist = await PlaylistService.createUserPlaylist(id);
    return res.json(newPlayslist);
  } catch (error) {
    next(error);
  }
};

const updatePlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { playlistId } = req.params;
  const image = req.file;
  let imageToBase64 = "";
  let requestBody = {};

  if (image) {
    const img = await readFile(image.path);
    imageToBase64 = Buffer.from(img.buffer).toString("base64");
    requestBody = {
      ...req.body,
      image: imageToBase64,
    };
  } else {
    requestBody = req.body;
  }

  const result = playlistUpdateSchema.safeParse(requestBody);

  if (result.success === false) {
    return res.json({ error: JSON.parse(result.error.message) });
  }

  const body = result.data;

  try {
    const updatedPlaylist = await PlaylistService.updatePlaylist(
      playlistId,
      body
    );
    return res.json(updatedPlaylist);
  } catch (error) {
    next(error);
  }
};

const addSongToPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { playlistId, songId } = req.params;
  try {
    await PlaylistService.addSongToPlaylist(playlistId, songId);
    return res.json({ add: true });
  } catch (error) {
    next(error);
  }
};

const removeSongOnPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { playlistId } = req.params;
  const { songId } = req.params;
  try {
    await PlaylistService.removeSongOnPlaylist(playlistId, songId);
    return res.json({ removed: true });
  } catch (error) {
    next(error);
  }
};

const countSongsByPlaylistId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const songsCount = await PlaylistService.countSongsByPlaylistId(id);
    return res.json(songsCount);
  } catch (error) {
    next(error);
  }
};

const getLikedSongsPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  try {
    const likedPlaylist = await PlaylistService.getLikedSongsPlaylist(userId);
    res.json(likedPlaylist);
  } catch (error) {
    next(error);
  }
};

export const PlaylistController = {
  getPlaylistsByUserId,
  getSongsByPlaylistId,
  createUserPlaylist,
  updatePlaylist,
  addSongToPlaylist,
  countSongsByPlaylistId,
  removeSongOnPlaylist,
  getLikedSongsPlaylist,
};
