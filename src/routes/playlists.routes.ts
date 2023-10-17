import { Router } from "express";
import {
  addSongToPlaylist,
  countSongsByPlaylistId,
  createUserPlaylist,
  getSongsByPlaylistId,
  getUserPlaylists,
  updatePlaylist,
} from "../controllers/PlaylistController";

const router = Router();

router.get("/api/users/:id/playlists", getUserPlaylists);
router.get("/api/playlists/:id/songs", getSongsByPlaylistId);
router.get("/api/playlists/:id/songs/count", countSongsByPlaylistId);
router.post("/api/users/:id/playlists", createUserPlaylist);
router.patch("/api/playlists/:id", updatePlaylist);
router.post("/api/playlists/:id/songs/:songId", addSongToPlaylist);

export const playlistRoutes = router;
