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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
const token_error_1 = __importDefault(require("./errors/token.error"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            throw new token_error_1.default.NotAuthorizationTokenError("No cabecera");
        }
        const token = header.replace("Bearer ", "");
        const tokenExist = yield prisma_1.prisma.token.findFirst({
            where: {
                jwtSecretKey: token,
            },
        });
        if (!tokenExist) {
            throw new token_error_1.default.InvalidTokenError("Token Invalido");
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_KEY || "");
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.authenticate = authenticate;
