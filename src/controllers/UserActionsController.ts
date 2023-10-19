import { Request, Response } from "express";
import { UserActionsService } from "../services/UserActionsService";
import EmptyResponseError from "../middlewares/errors/errors";

const likeSong = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { songId } = req.params;

  try {
    await UserActionsService.likeSongService(userId, songId);
    res.json({ liked: true });
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

const dislikeSong = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { songId } = req.params;

  try {
    await UserActionsService.dislikeSongService(userId, songId);
    res.status(200).json({ liked: false });
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      return res.json({ message: error.message });
    }
    return res.status(404);
  }
};

export const UserActionsController = {
  likeSong,
  dislikeSong,
};
