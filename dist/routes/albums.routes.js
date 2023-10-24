"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.albumRoutes = void 0;
const express_1 = require("express");
const AlbumController_1 = require("../controllers/AlbumController");
const authenticate_1 = require("../middlewares/authenticate");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = (0, express_1.Router)();
router.get("/api/albums", authenticate_1.authenticate, AlbumController_1.AlbumController.getAlbums);
router.post("/api/artists/:id/albums", authenticate_1.authenticate, multer_1.default.single("album_image"), AlbumController_1.AlbumController.createNewArtistAlbum);
router.get("/api/artists/:id/albums", authenticate_1.authenticate, AlbumController_1.AlbumController.getAlbumsByArtistId);
exports.albumRoutes = router;
