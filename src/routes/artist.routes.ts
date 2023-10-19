import { Router } from "express";
import { ArtistController } from "../controllers/ArtistController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/api/artists", ArtistController.createNewArtist);
router.get("/api/artists", ArtistController.getArtists);
router.get("/api/artists/:id", ArtistController.getArtistById);

export const artistRoutes = router;
