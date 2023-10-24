"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistController = void 0;
const PlaylistService_1 = require("../services/PlaylistService");
const playlistSchema_1 = require("../schemas/playlistSchema");
const promises_1 = require("fs/promises");
const getPlaylistsByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const playlists = yield PlaylistService_1.PlaylistService.getPlaylistsByUserIdService(id);
        return res.json(playlists);
    }
    catch (error) {
        next(error);
    }
});
const getSongsByPlaylistId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const resp = yield PlaylistService_1.PlaylistService.getSongsByPlaylistIdService(id);
        return res.json(resp);
    }
    catch (error) {
        next(error);
    }
});
const createUserPlaylist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const newPlayslist = yield PlaylistService_1.PlaylistService.createUserPlaylistService(id);
        return res.json(newPlayslist);
    }
    catch (error) {
        next(error);
    }
});
const updatePlaylist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlistId, userId } = req.params;
    const image = req.file;
    let imageToBase64 = "";
    let requestBody = {};
    if (image) {
        const img = yield (0, promises_1.readFile)(image.path);
        imageToBase64 = Buffer.from(img.buffer).toString("base64");
        requestBody = Object.assign(Object.assign({}, req.body), { image: imageToBase64 });
    }
    else {
        requestBody = req.body;
    }
    const result = playlistSchema_1.playlistUpdateSchema.safeParse(requestBody);
    if (result.success === false) {
        return res.json({ error: JSON.parse(result.error.message) });
    }
    const body = result.data;
    try {
        const updatedPlaylist = yield PlaylistService_1.PlaylistService.updatePlaylistService(playlistId, userId, body);
        return res.json(updatedPlaylist);
    }
    catch (error) {
        next(error);
    }
});
const addSongToPlaylist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlistId, songId } = req.params;
    try {
        yield PlaylistService_1.PlaylistService.addSongToPlaylistService(playlistId, songId);
        return res.json({ add: true });
    }
    catch (error) {
        next(error);
    }
});
const removeSongOnPlaylist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlistId } = req.params;
    const { songId } = req.params;
    try {
        yield PlaylistService_1.PlaylistService.removeSongOnPlaylistService(playlistId, songId);
        return res.json({ removed: true });
    }
    catch (error) {
        next(error);
    }
});
const countSongsByPlaylistId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const songsCount = yield PlaylistService_1.PlaylistService.countSongsByPlaylistIdService(id);
        return res.json(songsCount);
    }
    catch (error) {
        next(error);
    }
});
exports.PlaylistController = {
    getPlaylistsByUserId,
    getSongsByPlaylistId,
    createUserPlaylist,
    updatePlaylist,
    addSongToPlaylist,
    countSongsByPlaylistId,
    removeSongOnPlaylist,
};
