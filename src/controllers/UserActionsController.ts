import { NextFunction, Request, Response } from "express";
import { UserActionsService } from "../services/UserActionsService";

const likeSong = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, songId } = req.params;

  try {
    await UserActionsService.likeSong(userId, songId);
    return res.json({ liked: true });
  } catch (error) {
    next(error);
  }
};

const dislikeSong = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, songId } = req.params;

  try {
    await UserActionsService.dislikeSong(userId, songId);
    res.status(200).json({ liked: false });
  } catch (error) {
    next(error);
  }
};

const likeAlbum = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, albumId } = req.params;
  console.log(userId, albumId);
  try {
    await UserActionsService.likeAlbum(userId, albumId);
    res.status(200).json({ liked: true });
  } catch (error) {
    next(error);
  }
};

const dislikeAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, albumId } = req.params;

  try {
    await UserActionsService.dislikeAlbum(userId, albumId);
    res.status(200).json({ liked: false });
  } catch (error) {
    next(error);
  }
};

const followArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, artistId } = req.params;
  try {
    await UserActionsService.followArtist(userId, artistId);
    return res.status(200).json({ follow: true });
  } catch (error) {
    next(error);
  }
};

const unfollowArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, artistId } = req.params;
  try {
    await UserActionsService.unfollowArtist(userId, artistId);
    return res.status(200).json({ follow: false });
  } catch (error) {
    next(error);
  }
};

export const UserActionsController = {
  likeSong,
  dislikeSong,
  likeAlbum,
  dislikeAlbum,
  followArtist,
  unfollowArtist,
};
