import { Request, Response } from "express";
import {
  addSongToPlaylistService,
  countSongsByPlaylistService,
  createUserPlaylistService,
  getSongsByPlaylistIdService,
  getUserPlaylistsService,
  updatePlaylistService,
} from "../services/PlaylistService";

export const getUserPlaylists = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const playlists = await getUserPlaylistsService(id);
    return res.json(playlists);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const getSongsByPlaylistId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const resp = await getSongsByPlaylistIdService(id);
    return res.json(resp);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const createUserPlaylist = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const newPlayslist = await createUserPlaylistService(id);
    return res.json(newPlayslist);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  const body = req.body;
  const { id } = req.params;
  try {
    const updatedPlaylist = await updatePlaylistService(id, body);
    return res.json(updatedPlaylist);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const addSongToPlaylist = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { songId } = req.params;
  try {
    const addSong = await addSongToPlaylistService(id, songId);
    return res.json(addSong);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const countSongsByPlaylistId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const songsCount = await countSongsByPlaylistService(id);
    return res.json(songsCount);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};
