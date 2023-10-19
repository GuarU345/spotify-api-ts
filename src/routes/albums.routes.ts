import { Router } from "express";
import { AlbumController } from "../controllers/AlbumController";
import { authenticate } from "../middlewares/authenticate";
import upload from "../middlewares/multer";

const router = Router();

router.get("/api/albums", AlbumController.getAlbums);
router.post(
  "/api/artists/:id/albums",

  upload.single("album_image"),
  AlbumController.createNewArtistAlbum
);
router.get(
  "/api/artists/:id/albums",

  AlbumController.getAlbumsByArtist
);

export const albumRoutes = router;
