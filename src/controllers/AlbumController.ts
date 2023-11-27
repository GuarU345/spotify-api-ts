import { Request, Response, NextFunction } from "express";
import { AlbumService } from "../services/AlbumService";
import { albumSchema } from "../schemas/albumSchema";
import { readFile } from "fs/promises";
import { Buffer } from "buffer";

const createNewArtistAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const image = req.file;
  let imageToBase64 = "";
  let requestBody = {};

  if (image) {
    const img = await readFile(image.path);
    imageToBase64 = Buffer.from(img.buffer).toString("base64");
    requestBody = {
      ...req.body,
      album_image: imageToBase64,
    };
  } else {
    requestBody = req.body;
  }

  const result = albumSchema.safeParse(requestBody);

  if (result.success === false) {
    return res.status(422).json({ error: JSON.parse(result.error.message) });
  }

  const body = result.data;

  try {
    const newAlbum = await AlbumService.createArtistAlbum(
      id,
      body,
      imageToBase64
    );
    res.json(newAlbum);
  } catch (error) {}
};

const getAlbums = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const albums = await AlbumService.getAlbums();
    res.json(albums);
  } catch (error) {
    next(error);
  }
};

const getAlbumsByArtistId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const artistAlbums = await AlbumService.getAlbumsByArtistId(id);
    res.json(artistAlbums);
  } catch (error) {
    next(error);
  }
};

const getLikedAlbumsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  try {
    const likedAlbums = await AlbumService.getLikedAlbumsByUserId(userId);
    return res.json(likedAlbums);
  } catch (error) {
    next(error);
  }
};

const checkUserLikesAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, albumId } = req.params;
  try {
    const check = await AlbumService.checkUserLikesAlbum(userId, albumId);
    return res.json({ liked: check });
  } catch (error) {
    next(error);
  }
};

export const AlbumController = {
  createNewArtistAlbum,
  getAlbums,
  getAlbumsByArtistId,
  getLikedAlbumsByUserId,
  checkUserLikesAlbum,
};
