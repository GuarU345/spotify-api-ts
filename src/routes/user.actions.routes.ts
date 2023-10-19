import { Router } from "express";
import { UserActionsController } from "../controllers/UserActionsController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post(
  "/api/users/:userId/songs/:songId/likes",
  authenticate,
  UserActionsController.likeSong
);
router.delete(
  "/api/users/:userId/songs/:songId/likes",
  authenticate,
  UserActionsController.dislikeSong
);

export const userActionsRoutes = router;
