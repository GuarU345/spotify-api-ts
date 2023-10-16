import { Router } from "express";
import {
  createUserPlaylist,
  getUserPlaylists,
} from "../controllers/PlaylistController";

const router = Router();

router.get("/api/user/:id/playlists", getUserPlaylists);
router.post("/api/user/:id/playlists", createUserPlaylist);

export const playlistRoutes = router;
