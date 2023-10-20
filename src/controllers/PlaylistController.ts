import { Request, Response, NextFunction } from "express";
import { PlaylistService } from "../services/PlaylistService";

const getPlaylistsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const playlists = await PlaylistService.getPlaylistsByUserIdService(id);
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
    const resp = await PlaylistService.getSongsByPlaylistIdService(id);
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
    const newPlayslist = await PlaylistService.createUserPlaylistService(id);
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
  const body = req.body;
  const { playlistId, userId } = req.params;
  try {
    const updatedPlaylist = await PlaylistService.updatePlaylistService(
      playlistId,
      userId,
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
    await PlaylistService.addSongToPlaylistService(playlistId, songId);
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
    await PlaylistService.removeSongOnPlaylistService(playlistId, songId);
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
    const songsCount = await PlaylistService.countSongsByPlaylistIdService(id);
    return res.json(songsCount);
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
};
