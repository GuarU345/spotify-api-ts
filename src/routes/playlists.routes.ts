import { Router } from "express";
import { PlaylistController } from "../controllers/PlaylistController";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/multer";

const router = Router();

router.get(
  "/api/users/:id/playlists",
  authenticate,
  PlaylistController.getPlaylistsByUserId
);
router.get(
  "/api/playlists/:id/songs/count",
  authenticate,
  PlaylistController.countSongsByPlaylistId
);
router.get(
  "/api/users/:userId/playlists/love",
  authenticate,
  PlaylistController.getLikedSongsPlaylist
);
router.post(
  "/api/users/:id/playlists",
  authenticate,
  PlaylistController.createUserPlaylist
);
router.patch(
  "/api/playlists/:playlistId",
  authenticate,
  upload.single("image"),
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
router.delete(
  "/api/playlists/:playlistId",
  authenticate,
  PlaylistController.deletePlaylist
)

export const playlistRoutes = router;
