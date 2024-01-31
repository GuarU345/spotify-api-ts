import { Router } from "express";
import { AlbumController } from "../controllers/AlbumController";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/multer";

const router = Router();

router.get("/albums", authenticate, AlbumController.getAlbums);
router.post(
  "/artists/:id/albums",
  authenticate,
  upload.single("album_image"),
  AlbumController.createNewArtistAlbum
);
router.get(
  "/artists/:id/albums",
  authenticate,
  AlbumController.getAlbumsByArtistId
);
router.get(
  "/users/:userId/albums",
  authenticate,
  AlbumController.getLikedAlbumsByUserId
);
router.get(
  "/users/:userId/albums/:albumId",
  authenticate,
  AlbumController.checkUserLikesAlbum
);

export const albumRoutes = router;
