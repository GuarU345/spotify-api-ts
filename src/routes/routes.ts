import { Router } from "express";
import { artistRoutes } from "./artist.routes";
import { albumRoutes } from "./albums.routes";
import { songRoutes } from "./songs.routes";
import { userRoutes } from "./user.routes";
import { userActionsRoutes } from "./user.actions.routes";
import { playlistRoutes } from "./playlists.routes";

export const router = Router();

router.use(artistRoutes);
router.use(albumRoutes);
router.use(songRoutes);
router.use(userRoutes);
router.use(userActionsRoutes);
router.use(playlistRoutes);
