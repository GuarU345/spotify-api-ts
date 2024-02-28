import { Router } from "express";
import { UserActionsController } from "../controllers/UserActionsController";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.get("/search", authenticate, UserActionsController.globalSearch);
router.get(
  "/data/:id",
  authenticate,
  UserActionsController.userReproducingSomething
);
router.post(
  "/users/:userId/songs/:songId/likes",
  authenticate,
  UserActionsController.likeSong
);
router.post(
  "/users/:userId/albums/:albumId/likes",
  authenticate,
  UserActionsController.likeAlbum
);
router.post(
  "/users/:userId/artists/:artistId/follows",
  authenticate,
  UserActionsController.followArtist
);
router.post("/users/songs/save", authenticate, UserActionsController.songUserState)
router.delete(
  "/users/:userId/songs/:songId/likes",
  authenticate,
  UserActionsController.dislikeSong
);
router.delete(
  "/users/:userId/albums/:albumId/likes",
  authenticate,
  UserActionsController.dislikeAlbum
);
router.delete(
  "/users/:userId/artists/:artistId/follows",
  authenticate,
  UserActionsController.unfollowArtist
);

export const userActionsRoutes = router;
