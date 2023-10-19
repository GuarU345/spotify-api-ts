import { Router } from "express";
import { PlaylistController } from "../controllers/PlaylistController";

const router = Router();

router.get("/api/users/:id/playlists", PlaylistController.getUserPlaylists);
router.get("/api/playlists/:id/songs", PlaylistController.getSongsByPlaylistId);
router.get(
  "/api/playlists/:id/songs/count",
  PlaylistController.countSongsByPlaylistId
);
router.post("/api/users/:id/playlists", PlaylistController.createUserPlaylist);
router.patch("/api/playlists/:id", PlaylistController.updatePlaylist);
router.post(
  "/api/playlists/:id/songs/:songId",
  PlaylistController.addSongToPlaylist
);
router.delete(
  "/api/playlists/:id/songs/:songId",
  PlaylistController.removeSongOnPlaylist
);

export const playlistRoutes = router;
