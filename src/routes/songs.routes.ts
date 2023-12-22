import { Router } from "express";
import { SongController } from "../controllers/SongController";
import { authenticate } from "../middlewares/authenticate";
import upload from "../middlewares/multer";

const router = Router();

router.post(
  "/api/albums/:id/songs",
  authenticate,
  upload.uploadSong.single("mp3_file"),
  SongController.createNewSong
);
router.post(
  "/api/users/:userId/songs",
  authenticate,
  SongController.getLikedSongsByUserId
);
router.get("/api/songs", authenticate, SongController.getSongs);
router.get("/api/songs/:songId", authenticate, SongController.getSongById);
router.get(
  "/api/songs/:songId/stream",
  authenticate,
  SongController.streamSongById
);
router.get(
  "/api/albums/:id/songs",
  authenticate,
  SongController.getSongsByAlbumId
);
router.get(
  "/api/search/songs",
  authenticate,
  SongController.searchSongsForYourPlaylist
);

export const songRoutes = router;
