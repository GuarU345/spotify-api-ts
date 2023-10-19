import { NextFunction, Request, Response } from "express";
import { UserActionsService } from "../services/UserActionsService";
import EmptyResponseError from "../middlewares/errors/errors";
import GenericPrismaError from "../middlewares/errors/prisma.errors";

const likeSong = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { songId } = req.params;

  try {
    await UserActionsService.likeSongService(userId, songId);
    return res.json({ liked: true });
  } catch (error) {
    next(error);
  }
};

const dislikeSong = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { songId } = req.params;

  try {
    await UserActionsService.dislikeSongService(userId, songId);
    res.status(200).json({ liked: false });
  } catch (error) {
    next(error);
  }
};

export const UserActionsController = {
  likeSong,
  dislikeSong,
};
