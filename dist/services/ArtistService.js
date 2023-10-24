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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistService = void 0;
const prisma_1 = require("../utils/prisma");
const empty_error_1 = __importDefault(require("../middlewares/errors/empty.error"));
const prisma_error_1 = __importDefault(require("../middlewares/errors/prisma.error"));
const getArtistsService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artists = yield prisma_1.prisma.artist.findMany();
        if (!artists) {
            throw new empty_error_1.default("No se encontraron artistas");
        }
        return artists;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al buscar los artistas");
    }
});
const getArtistByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artist = yield prisma_1.prisma.artist.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!artist) {
            throw new empty_error_1.default("Artista no encontrado");
        }
        return artist;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al buscar el artista");
    }
});
const createArtistService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, nationality } = body;
    try {
        const newArtist = yield prisma_1.prisma.artist.create({
            data: {
                name,
                nationality,
            },
        });
        return newArtist;
    }
    catch (error) {
        console.error(error);
        throw new prisma_error_1.default("Error al crear el artista");
    }
});
exports.ArtistService = {
    getArtistsService,
    getArtistByIdService,
    createArtistService,
};
