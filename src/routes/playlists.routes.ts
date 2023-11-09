import { Router } from "express";
import { PlaylistController } from "../controllers/PlaylistController";
import { authenticate } from "../middlewares/authenticate";
import upload from "../middlewares/multer";

const router = Router();

router.get(
  "/api/users/:id/playlists",
  authenticate,
  PlaylistController.getPlaylistsByUserId
);
router.get(
  "/api/playlists/:id/songs",
  authenticate,
  PlaylistController.getSongsByPlaylistId
);
router.get(
  "/api/playlists/:id/songs/count",
  authenticate,
  PlaylistController.countSongsByPlaylistId
);
router.post(
  "/api/users/:id/playlists",
  authenticate,
  PlaylistController.createUserPlaylist
);
router.patch(
  "/api/users/:userId/playlists/:playlistId",
  authenticate,
  upload.uploadImage.single("image"),
  PlaylistController.updatePlaylist
);
router.post(
  "/api/playlists/:playlistId/songs/:songId",
  authenticate,
  PlaylistController.addSongToPlaylist
);
router.delete(
  "/api/playlists/:playlistId/songs/:songId",
  authenticate,
  PlaylistController.removeSongOnPlaylist
);

export const playlistRoutes = router;
