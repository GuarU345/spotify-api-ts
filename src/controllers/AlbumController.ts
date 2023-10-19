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

  if (image === undefined) {
    throw new Error();
  }

  const img = await readFile(image.path);

  const imageToBase64 = Buffer.from(img.buffer).toString("base64");

  const requestBody = {
    ...req.body,
    album_image: imageToBase64,
  };

  const result = albumSchema.safeParse(requestBody);

  if (result.success === false) {
    return res.status(422).json({ error: JSON.parse(result.error.message) });
  }

  const body = result.data;

  try {
    const newAlbum = await AlbumService.createArtistAlbumService(
      id,
      body,
      imageToBase64
    );
    res.json(newAlbum);
  } catch (error) {}
};

const getAlbums = async (_req, res: Response, next: NextFunction) => {
  try {
    const albums = await AlbumService.getAlbumsService();
    res.json(albums);
  } catch (error) {
    next(error);
  }
};

const getAlbumsByArtist = async (req, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const artistAlbums = await AlbumService.getAlbumsByArtistService(id);
    res.json(artistAlbums);
  } catch (error) {
    next(error);
  }
};

export const AlbumController = {
  createNewArtistAlbum,
  getAlbums,
  getAlbumsByArtist,
};
