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
exports.PlaylistService = void 0;
const empty_error_1 = __importDefault(require("../middlewares/errors/empty.error"));
const prisma_error_1 = __importDefault(require("../middlewares/errors/prisma.error"));
const prisma_1 = require("../utils/prisma");
const getPlaylistsByUserIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlists = yield prisma_1.prisma.playlist.findMany({
            where: {
                user_id: id,
            },
        });
        if (playlists.length === 0) {
            throw new empty_error_1.default("No se encontraron playlists de ese usuario");
        }
        return playlists;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al encontrar las playlists del usuario");
    }
});
const getSongsByPlaylistIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get specific playlist
        const playlist = yield prisma_1.prisma.playlist.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!playlist) {
            throw new empty_error_1.default("No se pudo encontrar la playlist");
        }
        //get info with playlist id
        const playlistData = yield prisma_1.prisma.playlistSong.findMany({
            where: {
                playlist_id: playlist.id,
            },
        });
        if (playlistData.length === 0) {
            throw new empty_error_1.default("Playlist vacia");
        }
        //get song ids saved in this playlist
        const songIds = playlistData.map((playlistSong) => playlistSong.song_id);
        //search songs by id iterating the song ids
        const songsInfo = yield prisma_1.prisma.song.findMany({
            where: {
                id: {
                    in: songIds,
                },
            },
            include: {
                artist: true,
                album: true,
            },
        });
        const playlistSongs = {
            playlist: playlist.name,
            playlistDescription: playlist.description,
            playlistImg: playlist.image,
            songs: songsInfo.map((playlistSong) => {
                var _a;
                return {
                    songName: playlistSong.name,
                    artistName: (_a = playlistSong.artist) === null || _a === void 0 ? void 0 : _a.name,
                    albumName: playlistSong.album.name,
                    albumImage: playlistSong.album.album_image,
                };
            }),
        };
        return playlistSongs;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al encontrar las canciones de esa playlist");
    }
});
const createUserPlaylistService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getPlaylists = yield prisma_1.prisma.playlist.findMany();
        const standardPlaylistName = `Playlist N. ${getPlaylists.length + 1}`;
        const createPlaylist = yield prisma_1.prisma.playlist.create({
            data: {
                name: standardPlaylistName,
                release_date: new Date().toISOString(),
                user_id: id,
                image: "not image",
            },
        });
        return createPlaylist;
    }
    catch (error) {
        console.error(error);
        throw new prisma_error_1.default("No se pudo crear la playlist");
    }
});
const updatePlaylistService = (id, userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, image } = body;
        const playlist = yield prisma_1.prisma.playlist.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!playlist) {
            throw new empty_error_1.default("No se pudo encontrar la playlist");
        }
        const updatePlaylist = yield prisma_1.prisma.playlist.update({
            data: {
                name,
                description,
                image,
            },
            where: {
                id: playlist.id,
                user_id: userId,
            },
        });
        return updatePlaylist;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al tratar de actualizar la playlist");
    }
});
const addSongToPlaylistService = (playlistId, songId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlist = yield prisma_1.prisma.playlist.findUnique({
            where: {
                id: Number(playlistId),
            },
        });
        if (!playlist) {
            throw new empty_error_1.default("No se pudo encontrar la playlist");
        }
        const song = yield prisma_1.prisma.song.findUnique({
            where: {
                id: Number(songId),
            },
        });
        if (!song) {
            throw new empty_error_1.default("No se pudo encontrar la cancion");
        }
        const addSong = yield prisma_1.prisma.playlistSong.create({
            data: {
                playlist_id: playlist.id,
                song_id: song.id,
            },
        });
        return addSong;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al tratar de añadir la cancion a la playlist");
    }
});
const removeSongOnPlaylistService = (playlistId, songId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlist = yield prisma_1.prisma.playlist.findUnique({
            where: {
                id: Number(playlistId),
            },
        });
        if (!playlist) {
            throw new empty_error_1.default("No se pudo encontrar la playlist");
        }
        const song = yield prisma_1.prisma.song.findUnique({
            where: {
                id: Number(songId),
            },
        });
        if (!song) {
            throw new empty_error_1.default("No se pudo encontrar la cancion");
        }
        const playlistSong = yield prisma_1.prisma.playlistSong.findFirst({
            where: {
                AND: [{ playlist_id: playlist.id }, { song_id: song.id }],
            },
        });
        if (!playlistSong) {
            throw new empty_error_1.default("No se encontro la cancion en esa playlist");
        }
        const removeSong = yield prisma_1.prisma.playlistSong.delete({
            where: {
                id: playlistSong.id,
            },
        });
        return removeSong;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al tratar de eliminar la cancion de la playlist");
    }
});
const countSongsByPlaylistIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlist = yield prisma_1.prisma.playlist.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                PlaylistSongs: true,
            },
        });
        if (!playlist) {
            throw new empty_error_1.default("No se pudo encontrar la playlist");
        }
        return {
            count: playlist.PlaylistSongs.length,
        };
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al realizar la consulta");
    }
});
exports.PlaylistService = {
    getPlaylistsByUserIdService,
    addSongToPlaylistService,
    updatePlaylistService,
    countSongsByPlaylistIdService,
    createUserPlaylistService,
    getSongsByPlaylistIdService,
    removeSongOnPlaylistService,
};
