import { Router } from "express";
import { AlbumController } from "../controllers/AlbumController";
import { authenticate } from "../middlewares/authenticate";
import upload from "../middlewares/multer";

const router = Router();

router.get("/api/albums", authenticate, AlbumController.getAlbums);
router.post(
  "/api/artists/:id/albums",
  authenticate,
  upload.single("album_image"),
  AlbumController.createNewArtistAlbum
);
router.get(
  "/api/artists/:id/albums",
  authenticate,
  AlbumController.getAlbumsByArtistId
);
router.get("/api/users/:userId/albums", AlbumController.getLikedAlbumsByUserId);

export const albumRoutes = router;
