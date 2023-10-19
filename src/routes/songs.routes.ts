import { Router } from "express";
import { SongController } from "../controllers/SongController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/api/albums/:id/songs", SongController.createNewSong);
router.get("/api/songs", SongController.getSongs);
router.get("/api/albums/:id/songs", SongController.getSongsByAlbum);
router.get("/api/users/:id/songs", SongController.getLikedSongsByUser);

export const songRoutes = router;
