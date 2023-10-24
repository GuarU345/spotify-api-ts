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
exports.UserActionsService = void 0;
const empty_error_1 = __importDefault(require("../middlewares/errors/empty.error"));
const prisma_1 = require("../utils/prisma");
const prisma_error_1 = __importDefault(require("../middlewares/errors/prisma.error"));
const likeSongService = (userId, songId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new empty_error_1.default("Usuario no existente");
        }
        const likeSong = yield prisma_1.prisma.like.create({
            data: {
                user_id: user.id,
                song_id: Number(songId),
            },
        });
        return likeSong;
    }
    catch (error) {
        console.error(error);
        throw new prisma_error_1.default("No se pudo agregar la cancion en tus me gusta");
    }
});
const dislikeSongService = (userId, songId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new empty_error_1.default("Usuario no existente");
        }
        const searchUserSong = yield prisma_1.prisma.like.findFirst({
            where: {
                AND: [{ user_id: user.id }, { song_id: Number(songId) }],
            },
        });
        if (!searchUserSong) {
            throw new empty_error_1.default("Registro no existente");
        }
        const dislikeSong = yield prisma_1.prisma.like.delete({
            where: {
                id: searchUserSong.id,
            },
        });
        return dislikeSong;
    }
    catch (error) {
        if (error instanceof empty_error_1.default) {
            throw error;
        }
        console.error(error);
        throw new prisma_error_1.default("Error al intentar eliminar el registro");
    }
});
exports.UserActionsService = {
    likeSongService,
    dislikeSongService,
};
