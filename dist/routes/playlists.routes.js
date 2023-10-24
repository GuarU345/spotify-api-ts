"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playlistRoutes = void 0;
const express_1 = require("express");
const PlaylistController_1 = require("../controllers/PlaylistController");
const authenticate_1 = require("../middlewares/authenticate");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
router.get("/api/users/:id/playlists", authenticate_1.authenticate, PlaylistController_1.PlaylistController.getPlaylistsByUserId);
router.get("/api/playlists/:id/songs", authenticate_1.authenticate, PlaylistController_1.PlaylistController.getSongsByPlaylistId);
router.get("/api/playlists/:id/songs/count", authenticate_1.authenticate, PlaylistController_1.PlaylistController.countSongsByPlaylistId);
router.post("/api/users/:id/playlists", authenticate_1.authenticate, PlaylistController_1.PlaylistController.createUserPlaylist);
router.patch("/api/users/:userId/playlists/:playlistId", authenticate_1.authenticate, multer_1.default.single("image"), PlaylistController_1.PlaylistController.updatePlaylist);
router.post("/api/playlists/:playlistId/songs/:songId", authenticate_1.authenticate, PlaylistController_1.PlaylistController.addSongToPlaylist);
router.delete("/api/playlists/:playlistId/songs/:songId", authenticate_1.authenticate, PlaylistController_1.PlaylistController.removeSongOnPlaylist);
exports.playlistRoutes = router;
