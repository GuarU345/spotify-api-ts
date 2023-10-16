import { Request, Response } from "express";
import {
  createUserPlaylistService,
  getUserPlaylistsService,
} from "../services/PlaylistService";

export const getUserPlaylists = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const playlists = await getUserPlaylistsService(id);
    return res.json(playlists);
  } catch (error: any) {
    return res.status(404).json(error.message);
  }
};

export const createUserPlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newPlayslist = await createUserPlaylistService(id);
    return res.json(newPlayslist);
  } catch (error: any) {
    return res.status(404).json(error.message);
  }
};
