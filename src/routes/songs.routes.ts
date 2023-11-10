import { Router } from "express";
import { SongController } from "../controllers/SongController";
import { authenticate } from "../middlewares/authenticate";
import upload from "../middlewares/multer";

const router = Router();

router.post(
  "/api/albums/:id/songs",
  upload.uploadSong.single("mp3_file"),
  SongController.createNewSong
);
router.get("/api/songs", authenticate, SongController.getSongs);
router.get("/api/songs/:songId", authenticate, SongController.getSongById);
router.get(
  "/api/albums/:id/songs",
  authenticate,
  SongController.getSongsByAlbumId
);
router.get(
  "/api/users/:id/songs",
  authenticate,
  SongController.getLikedSongsByUserId
);

export const songRoutes = router;
