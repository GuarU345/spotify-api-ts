import { Router } from "express";
import { SongController } from "../controllers/SongController";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/multer";

const router = Router();

router.post(
  "/albums/:id/songs",
  authenticate,
  upload.single("mp3_file"),
  SongController.createNewSong
);
router.post(
  "/users/:userId/songs",
  authenticate,
  SongController.getLikedSongsByUserId
);
router.get("/songs", authenticate, SongController.getSongs);
router.get("/songs/:songId", authenticate, SongController.getSongById);
router.get(
  "/albums/:id/songs",
  authenticate,
  SongController.getSongsByAlbumId
);
router.get(
  "/playlists/:id/songs",
  authenticate,
  SongController.getSongsByPlaylistId
);
router.get(
  "/search/songs",
  authenticate,
  SongController.searchSongsForYourPlaylist
);

export const songRoutes = router;
