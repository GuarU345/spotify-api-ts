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
exports.AlbumService = void 0;
const empty_error_1 = __importDefault(require("../middlewares/errors/empty.error"));
const prisma_error_1 = __importDefault(require("../middlewares/errors/prisma.error"));
const prisma_1 = require("../utils/prisma");
// Crea un nuevo álbum para un artista dado.
const createArtistAlbumService = (artistId, body, album_image) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, release_date } = body;
    try {
        const newAlbum = yield prisma_1.prisma.album.create({
            data: {
                name,
                release_date,
                album_image,
                artist_id: Number(artistId),
            },
        });
        return newAlbum;
    }
    catch (error) {
        console.error(error);
        throw new prisma_error_1.default("Error al crear un nuevo album");
    }
});
//Obtiene un album por su id
const getAlbumByIdService = (albumId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const album = yield prisma_1.prisma.album.findUnique({
            where: {
                id: Number(albumId),
            },
        });
        if (!album) {
            throw new empty_error_1.default("No se pudo encontrar el album");
        }
        return album;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al buscar el album");
    }
});
// Obtiene todos los álbumes con información detallada del artista.
const getAlbumsService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const albums = yield prisma_1.prisma.album.findMany();
        if (!albums) {
            throw new empty_error_1.default("No se encontraron albums");
        }
        return albums;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al traer los albums");
    }
});
// Obtiene todos los álbumes de un artista por su ID.
const getAlbumsByArtistIdService = (artistId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artist = yield prisma_1.prisma.artist.findUnique({
            include: {
                albums: true,
            },
            where: {
                id: Number(artistId),
            },
        });
        if (!artist) {
            throw new empty_error_1.default("Artista no encontrado");
        }
        const artistAlbums = {
            artist: artist === null || artist === void 0 ? void 0 : artist.name,
            albums: artist.albums.length > 0
                ? artist === null || artist === void 0 ? void 0 : artist.albums.map((album) => {
                    return {
                        id: album.id,
                        albumName: album.name,
                        releaseDate: album.release_date,
                    };
                })
                : "No se encontraron albums",
        };
        return artistAlbums;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al traer los albums del artista");
    }
});
exports.AlbumService = {
    getAlbumsService,
    getAlbumByIdService,
    getAlbumsByArtistIdService,
    createArtistAlbumService,
};
