import { Router } from "express";
import {
  createUserPlaylist,
  getUserPlaylists,
  updatePlaylist,
} from "../controllers/PlaylistController";

const router = Router();

router.get("/api/user/:id/playlists", getUserPlaylists);
router.post("/api/user/:id/playlists", createUserPlaylist);
router.patch("/api/playlists/:id", updatePlaylist);

export const playlistRoutes = router;
