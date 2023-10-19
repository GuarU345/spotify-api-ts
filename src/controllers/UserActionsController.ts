import { Request, Response } from "express";
import { UserActionsService } from "../services/UserActionsService";
import EmptyResponseError from "../middlewares/errors/errors";
import GenericPrismaError from "../middlewares/errors/prisma.errors";

const likeSong = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { songId } = req.params;

  try {
    await UserActionsService.likeSongService(userId, songId);
    return res.json({ liked: true });
  } catch (error) {
    if (error instanceof GenericPrismaError) {
      return res.status(404).json({ error: error.message });
    }
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
    if (error instanceof GenericPrismaError) {
      return res.status(404).json({ error: error.message });
    }
  }
};

export const UserActionsController = {
  likeSong,
  dislikeSong,
};
