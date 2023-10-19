import { Router } from "express";
import { ArtistController } from "../controllers/ArtistController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/api/artists", authenticate, ArtistController.createNewArtist);
router.get("/api/artists", authenticate, ArtistController.getArtists);
router.get("/api/artists/:id", authenticate, ArtistController.getArtistById);

export const artistRoutes = router;
