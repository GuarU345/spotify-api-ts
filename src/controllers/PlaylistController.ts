import { Request, Response } from "express";
import { PlaylistService } from "../services/PlaylistService";
import EmptyResponseError from "../middlewares/errors/errors";

const getUserPlaylists = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const playlists = await PlaylistService.getUserPlaylistsService(id);
    return res.json(playlists);
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      return res.json({ message: error.message });
    }
    return res.status(404).json(error);
  }
};

const getSongsByPlaylistId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const resp = await PlaylistService.getSongsByPlaylistIdService(id);
    return res.json(resp);
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      return res.json({ message: error.message });
    }
    return res.status(404).json(error);
  }
};
const createUserPlaylist = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const newPlayslist = await PlaylistService.createUserPlaylistService(id);
    return res.json(newPlayslist);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};
const updatePlaylist = async (req: Request, res: Response) => {
  const body = req.body;
  const { id } = req.params;
  try {
    const updatedPlaylist = await PlaylistService.updatePlaylistService(
      id,
      body
    );
    return res.json(updatedPlaylist);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};
const addSongToPlaylist = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { songId } = req.params;
  try {
    const addSong = await PlaylistService.addSongToPlaylistService(id, songId);
    return res.json(addSong);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};
const countSongsByPlaylistId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const songsCount = await PlaylistService.countSongsByPlaylistService(id);
    return res.json(songsCount);
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      return res.json({ message: error.message });
    }
    return res.status(404).json(error);
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
