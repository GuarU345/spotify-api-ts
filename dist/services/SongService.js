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
exports.SongService = void 0;
const empty_error_1 = __importDefault(require("../middlewares/errors/empty.error"));
const prisma_error_1 = __importDefault(require("../middlewares/errors/prisma.error"));
const prisma_1 = require("../utils/prisma");
const AlbumService_1 = require("./AlbumService");
const createSongService = (albumId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, duration } = body;
    try {
        const albumData = yield AlbumService_1.AlbumService.getAlbumByIdService(albumId);
        if (!albumData) {
            throw new Error("No puedes crear una cancion en un album que no existe");
        }
        const newSong = yield prisma_1.prisma.song.create({
            data: {
                name,
                duration,
                album_id: Number(albumId),
                artist_id: albumData === null || albumData === void 0 ? void 0 : albumData.artist_id,
            },
        });
        return newSong;
    }
    catch (error) {
        console.error(error);
        throw new prisma_error_1.default("Error al crear la cancion");
    }
});
const getAllSongsOrSongByNameService = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songs = yield prisma_1.prisma.song.findMany({
            include: {
                artist: true,
                album: true,
            },
            where: {
                name: {
                    contains: name,
                },
            },
        });
        if (songs.length < 1) {
            throw new Error("Ninguna cancion coincide con la busqueda");
        }
        const songsWithData = songs.map((song) => {
            var _a;
            return {
                artistId: song.artist_id,
                artist: (_a = song === null || song === void 0 ? void 0 : song.artist) === null || _a === void 0 ? void 0 : _a.name,
                album: {
                    albumId: song === null || song === void 0 ? void 0 : song.album.id,
                    albumName: song.album.name,
                    albumImage: song === null || song === void 0 ? void 0 : song.album.album_image,
                },
                song: {
                    songId: song.id,
                    songName: song === null || song === void 0 ? void 0 : song.name,
                },
            };
        });
        return songsWithData;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al tratar de realizar la busqueda");
    }
});
const getSongsByAlbumIdService = (albumId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const album = yield prisma_1.prisma.album.findUnique({
            include: {
                songs: true,
                artist: true,
            },
            where: {
                id: Number(albumId),
            },
        });
        if (!album) {
            throw new empty_error_1.default("Album no encontrado");
        }
        const songsAlbum = {
            artist: album === null || album === void 0 ? void 0 : album.artist.name,
            album: album === null || album === void 0 ? void 0 : album.name,
            songs: album.songs.length > 0
                ? album === null || album === void 0 ? void 0 : album.songs.map((song) => {
                    return {
                        id: song.id,
                        songName: song.name,
                    };
                })
                : "No se encontraron canciones",
        };
        return songsAlbum;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al tratar de encontrar las canciones");
    }
});
const getLikedSongsByUserIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchLikedSongs = yield prisma_1.prisma.like.findMany({
            where: {
                user_id: id,
            },
        });
        if (searchLikedSongs.length === 0) {
            throw new empty_error_1.default("No tienes canciones con me gusta");
        }
        const likedSongIds = searchLikedSongs.map((likedSong) => likedSong.song_id);
        const likedSongsData = yield prisma_1.prisma.song.findMany({
            where: {
                id: {
                    in: likedSongIds,
                },
            },
            include: {
                artist: true,
                album: true,
            },
        });
        const likedSongs = likedSongsData.map((likedSong) => {
            var _a;
            return {
                id: likedSong.id,
                artist: (_a = likedSong.artist) === null || _a === void 0 ? void 0 : _a.name,
                song: likedSong.name,
                album: {
                    albumId: likedSong.album.id,
                    albumName: likedSong.album.name,
                    albumImage: likedSong.album.album_image,
                },
            };
        });
        return likedSongs;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al tratar de encontrar las canciones");
    }
});
exports.SongService = {
    createSongService,
    getAllSongsOrSongByNameService,
    getSongsByAlbumIdService,
    getLikedSongsByUserIdService,
};
