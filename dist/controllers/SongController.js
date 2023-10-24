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
exports.SongController = void 0;
const SongService_1 = require("../services/SongService");
const songSchema_1 = require("../schemas/songSchema");
const createNewSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = songSchema_1.songSchema.safeParse(req.body);
    if (result.success === false) {
        return res.status(422).json({ error: JSON.parse(result.error.message) });
    }
    const body = result.data;
    try {
        const newSong = yield SongService_1.SongService.createSongService(id, body);
        res.json(newSong);
    }
    catch (error) {
        next(error);
    }
});
const getSongs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    try {
        const songWithData = yield SongService_1.SongService.getAllSongsOrSongByNameService(name);
        res.json(songWithData);
    }
    catch (error) {
        next(error);
    }
});
const getSongsByAlbumId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const songsAlbum = yield SongService_1.SongService.getSongsByAlbumIdService(id);
        return res.json(songsAlbum);
    }
    catch (error) {
        next(error);
    }
});
const getLikedSongsByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const likedSongs = yield SongService_1.SongService.getLikedSongsByUserIdService(id);
        res.json(likedSongs);
    }
    catch (error) {
        next(error);
    }
});
exports.SongController = {
    createNewSong,
    getSongsByAlbumId,
    getSongs,
    getLikedSongsByUserId,
};
