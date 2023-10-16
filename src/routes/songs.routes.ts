import { Router } from "express";
import { SongController } from "../controllers/SongController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/api/album/:id/songs", authenticate, SongController.createNewSong);
router.get("/api/songs", authenticate, SongController.getSongByName);
router.get(
  "/api/album/:id/songs",
  authenticate,
  SongController.getSongsByAlbum
);
router.get("/api/user/:id/songs", SongController.getLikedSongsByUser);

export const songRoutes = router;
