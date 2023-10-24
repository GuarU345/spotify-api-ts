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
exports.UserActionsController = void 0;
const UserActionsService_1 = require("../services/UserActionsService");
const likeSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, songId } = req.params;
    try {
        yield UserActionsService_1.UserActionsService.likeSongService(userId, songId);
        return res.json({ liked: true });
    }
    catch (error) {
        next(error);
    }
});
const dislikeSong = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, songId } = req.params;
    try {
        yield UserActionsService_1.UserActionsService.dislikeSongService(userId, songId);
        res.status(200).json({ liked: false });
    }
    catch (error) {
        next(error);
    }
});
exports.UserActionsController = {
    likeSong,
    dislikeSong,
};
