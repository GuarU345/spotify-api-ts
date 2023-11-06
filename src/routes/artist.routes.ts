import { Router } from "express";
import { ArtistController } from "../controllers/ArtistController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/api/artists", authenticate, ArtistController.createNewArtist);
router.get("/api/artists", authenticate, ArtistController.getArtists);
router.get("/api/artists/:id", authenticate, ArtistController.getArtistById);
router.get(
  "/api/users/:userId/artists",
  authenticate,
  ArtistController.getFollowedArtistsByUserId
);

export const artistRoutes = router;
