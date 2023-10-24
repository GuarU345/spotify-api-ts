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
exports.UserService = exports.getUserDataByTokenService = void 0;
const prisma_1 = require("../utils/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const user_error_1 = __importDefault(require("../middlewares/errors/user.error"));
const prisma_error_1 = __importDefault(require("../middlewares/errors/prisma.error"));
const signupService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = body;
    try {
        const hashedPassword = yield argon2_1.default.hash(password);
        const existUsers = yield prisma_1.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: email,
                    },
                    {
                        username: username,
                    },
                ],
            },
        });
        if (existUsers && existUsers.email === email) {
            throw new Error("La cuenta con ese email ya existe");
        }
        else if (existUsers && existUsers.username === username) {
            throw new Error("El nombre de usuario ya existe");
        }
        const newUser = yield prisma_1.prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        return newUser;
    }
    catch (error) {
        throw new prisma_error_1.default("Error al intentar registrarte");
    }
});
const signinService = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = body;
        const isRegister = yield prisma_1.prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                tokens: true,
            },
        });
        if (!isRegister || !(yield argon2_1.default.verify(isRegister.password, password))) {
            throw new user_error_1.default("Credenciales Invalidas");
        }
        const tokenIds = isRegister.tokens.map((token) => token.id);
        if (tokenIds.length > 0) {
            yield prisma_1.prisma.token.delete({
                where: {
                    id: tokenIds[0],
                },
            });
        }
        const secretKey = process.env.JWT_KEY || "";
        const token = jsonwebtoken_1.default.sign({ id: isRegister.id, email: isRegister.email }, secretKey);
        const newToken = yield prisma_1.prisma.token.create({
            data: {
                jwtSecretKey: token,
                user_id: isRegister.id,
            },
        });
        return newToken.jwtSecretKey;
    }
    catch (error) {
        if (error instanceof user_error_1.default) {
            throw error;
        }
        else {
            console.error(error);
            throw new prisma_error_1.default("No se ha podido iniciar sesion");
        }
    }
});
const getUserDataByTokenService = (bearer) => __awaiter(void 0, void 0, void 0, function* () {
    const token = bearer.replace("Bearer", "").trim();
    const userToken = yield prisma_1.prisma.token.findFirst({
        where: {
            jwtSecretKey: token,
        },
    });
    const user = yield prisma_1.prisma.user.findUnique({
        where: {
            id: userToken === null || userToken === void 0 ? void 0 : userToken.user_id,
        },
    });
    return user === null || user === void 0 ? void 0 : user.id;
});
exports.getUserDataByTokenService = getUserDataByTokenService;
exports.UserService = {
    signupService,
    signinService,
};
