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
  UserActionsController.likeAlbum
);
router.delete(
  "/api/users/:userId/songs/:songId/likes",
  authenticate,
  UserActionsController.dislikeSong
);
router.delete(
  "/api/users/:userId/albums/:albumId/likes",
  UserActionsController.dislikeAlbum
);

export const userActionsRoutes = router;
