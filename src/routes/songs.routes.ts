import { Router } from "express";
import { SongController } from "../controllers/SongController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/api/album/:id/songs", SongController.createNewSong);
router.get("/api/songs", SongController.getSongs);
router.get("/api/album/:id/songs", SongController.getSongsByAlbum);
router.get("/api/user/:id/songs", SongController.getLikedSongsByUser);

export const songRoutes = router;
