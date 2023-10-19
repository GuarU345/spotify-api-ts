import { Request, Response, NextFunction } from "express";
import { PlaylistService } from "../services/PlaylistService";

const getUserPlaylists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const playlists = await PlaylistService.getUserPlaylistsService(id);
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
  const { id } = req.params;
  try {
    const updatedPlaylist = await PlaylistService.updatePlaylistService(
      id,
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
  const { id } = req.params;
  const { songId } = req.params;
  try {
    const addSong = await PlaylistService.addSongToPlaylistService(id, songId);
    return res.json(addSong);
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
    const songsCount = await PlaylistService.countSongsByPlaylistService(id);
    return res.json(songsCount);
  } catch (error) {
    next(error);
  }
};

export const PlaylistController = {
  getUserPlaylists,
  getSongsByPlaylistId,
  createUserPlaylist,
  updatePlaylist,
  addSongToPlaylist,
  countSongsByPlaylistId,
};
