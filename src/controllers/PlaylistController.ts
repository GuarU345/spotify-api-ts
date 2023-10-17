import { Request, Response } from "express";
import {
  createUserPlaylistService,
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

export const createUserPlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newPlayslist = await createUserPlaylistService(id);
    return res.json(newPlayslist);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { id } = req.params;
    const updatedPlaylist = await updatePlaylistService(id, body);
    return res.json(updatedPlaylist);
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};
