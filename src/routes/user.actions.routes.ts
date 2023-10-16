import { Router } from "express";
import { UserActionsController } from "../controllers/UserActionsController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post(
  "/api/likes/user/:userId/song/:songId",
  authenticate,
  UserActionsController.likeSong
);
router.delete(
  "/api/likes/user/:userId/song/:songId",
  authenticate,
  UserActionsController.dislikeSong
);

export const userActionsRoutes = router;
