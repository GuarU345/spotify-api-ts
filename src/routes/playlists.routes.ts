import { Router } from "express";
import { PlaylistController } from "../controllers/PlaylistController";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/multer";

const router = Router();

router.get(
  "/users/:id/playlists",
  authenticate,
  PlaylistController.getPlaylistsByUserId
);
router.get("/playlists/:id", authenticate, PlaylistController.getPlaylistById)
router.get(
  "/playlists/:id/songs/count",
  authenticate,
  PlaylistController.countSongsByPlaylistId
);
router.get(
  "/users/:userId/playlists/love",
  authenticate,
  PlaylistController.getLikedSongsPlaylist
);
router.post(
  "/users/:id/playlists",
  authenticate,
  PlaylistController.createUserPlaylist
);
router.patch(
  "/playlists/:playlistId",
  authenticate,
  upload.single("image"),
  PlaylistController.updatePlaylist
);
router.post(
  "/playlists/:playlistId/songs/:songId",
  authenticate,
  PlaylistController.addSongToPlaylist
);
router.delete(
  "/playlists/:playlistId/songs/:songId",
  authenticate,
  PlaylistController.removeSongOnPlaylist
);
router.delete(
  "/playlists/:playlistId",
  authenticate,
  PlaylistController.deletePlaylist
)

export const playlistRoutes = router;
