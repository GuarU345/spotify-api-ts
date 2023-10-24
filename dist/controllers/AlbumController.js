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
exports.AlbumController = void 0;
const AlbumService_1 = require("../services/AlbumService");
const albumSchema_1 = require("../schemas/albumSchema");
const promises_1 = require("fs/promises");
const buffer_1 = require("buffer");
const createNewArtistAlbum = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const image = req.file;
    let imageToBase64 = "";
    let requestBody = {};
    if (image) {
        const img = yield (0, promises_1.readFile)(image.path);
        imageToBase64 = buffer_1.Buffer.from(img.buffer).toString("base64");
        requestBody = Object.assign(Object.assign({}, req.body), { album_image: imageToBase64 });
    }
    else {
        requestBody = req.body;
    }
    const result = albumSchema_1.albumSchema.safeParse(requestBody);
    if (result.success === false) {
        return res.status(422).json({ error: JSON.parse(result.error.message) });
    }
    const body = result.data;
    try {
        const newAlbum = yield AlbumService_1.AlbumService.createArtistAlbumService(id, body, imageToBase64);
        res.json(newAlbum);
    }
    catch (error) { }
});
const getAlbums = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const albums = yield AlbumService_1.AlbumService.getAlbumsService();
        res.json(albums);
    }
    catch (error) {
        next(error);
    }
});
const getAlbumsByArtistId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const artistAlbums = yield AlbumService_1.AlbumService.getAlbumsByArtistIdService(id);
        res.json(artistAlbums);
    }
    catch (error) {
        next(error);
    }
});
exports.AlbumController = {
    createNewArtistAlbum,
    getAlbums,
    getAlbumsByArtistId,
};
