import { Router } from "express";
import { UserActionsController } from "../controllers/UserActionsController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.get("/api/search", authenticate, UserActionsController.globalSearch);
router.get(
  "/api/data/:id",
  authenticate,
  UserActionsController.userReproducingSomething
);
router.post(
  "/api/users/:userId/songs/:songId/likes",
  authenticate,
  UserActionsController.likeSong
);
router.post(
  "/api/users/:userId/albums/:albumId/likes",
  authenticate,
  UserActionsController.likeAlbum
);
router.post(
  "/api/users/:userId/artists/:artistId/follows",
  authenticate,
  UserActionsController.followArtist
);
router.delete(
  "/api/users/:userId/songs/:songId/likes",
  authenticate,
  UserActionsController.dislikeSong
);
router.delete(
  "/api/users/:userId/albums/:albumId/likes",
  authenticate,
  UserActionsController.dislikeAlbum
);
router.delete(
  "/api/users/:userId/artists/:artistId/follows",
  authenticate,
  UserActionsController.unfollowArtist
);

export const userActionsRoutes = router;
