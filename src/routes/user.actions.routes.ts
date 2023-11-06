import { Router } from "express";
import { UserActionsController } from "../controllers/UserActionsController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

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
router.post(
  "/api/users/:userId/artists/:artistId/follows",
  authenticate,
  UserActionsController.followArtist
);

export const userActionsRoutes = router;
