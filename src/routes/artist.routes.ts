import { Router } from "express";
import { ArtistController } from "../controllers/ArtistController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post("/artists", authenticate, ArtistController.createNewArtist);
router.get("/artists", authenticate, ArtistController.getArtists);
router.get("/artists/:id", authenticate, ArtistController.getArtistById);
router.get(
  "/users/:userId/artists",
  authenticate,
  ArtistController.getFollowedArtistsByUserId
);

export const artistRoutes = router;
