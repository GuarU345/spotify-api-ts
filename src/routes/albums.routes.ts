import { Router } from "express";
import { AlbumController } from "../controllers/AlbumController";
import { authenticate } from "../middlewares/authenticate";
import upload from "../middlewares/multer";

const router = Router();

router.get("/api/albums", authenticate, AlbumController.getAlbums);
router.post(
  "/api/artist/:id/albums",
  authenticate,
  upload.single("album_image"),
  AlbumController.createNewArtistAlbum
);
router.get(
  "/api/artist/:id/albums",
  authenticate,
  AlbumController.getAlbumsByArtist
);

export const albumRoutes = router;
