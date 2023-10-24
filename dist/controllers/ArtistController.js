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
exports.ArtistController = void 0;
const artistSchema_1 = require("../schemas/artistSchema");
const ArtistService_1 = require("../services/ArtistService");
const createNewArtist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = artistSchema_1.artistSchema.safeParse(req.body);
    if (result.success === false) {
        return res.status(422).json({ message: JSON.parse(result.error.message) });
    }
    const body = result.data;
    try {
        const newArtist = yield ArtistService_1.ArtistService.createArtistService(body);
        res.json(newArtist);
    }
    catch (error) {
        next(error);
    }
});
const getArtists = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artists = yield ArtistService_1.ArtistService.getArtistsService();
        res.json(artists);
    }
    catch (error) {
        next(error);
    }
});
const getArtistById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const artist = yield ArtistService_1.ArtistService.getArtistByIdService(id);
        res.json(artist);
    }
    catch (error) {
        next(error);
    }
});
exports.ArtistController = {
    createNewArtist,
    getArtists,
    getArtistById,
};
