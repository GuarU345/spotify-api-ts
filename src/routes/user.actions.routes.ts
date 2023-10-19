import { Router } from "express";
import { UserActionsController } from "../controllers/UserActionsController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post(
  "/api/likes/users/:userId/songs/:songId",
  UserActionsController.likeSong
);
router.delete(
  "/api/likes/users/:userId/songs/:songId",
  UserActionsController.dislikeSong
);

export const userActionsRoutes = router;
