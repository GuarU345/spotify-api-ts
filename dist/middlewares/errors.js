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
exports.handleError = void 0;
const empty_error_1 = __importDefault(require("./errors/empty.error"));
const prisma_error_1 = __importDefault(require("./errors/prisma.error"));
const user_error_1 = __importDefault(require("./errors/user.error"));
const token_error_1 = __importDefault(require("./errors/token.error"));
const handleError = (err, _req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    // Verifica si el error es de tipo InvalidCredentialsError
    if (err instanceof user_error_1.default) {
        return res.status(401).json({ message: err.message });
    }
    if (err instanceof empty_error_1.default) {
        return res.status(200).json({ message: err.message });
    }
    // Verifica si el error es de tipo GenericPrismaError
    if (err instanceof prisma_error_1.default) {
        return res.status(500).json({ error: err.message });
    }
    if (err instanceof token_error_1.default.NotAuthorizationTokenError) {
        return res.status(500).json({ error: err.message });
    }
    if (err instanceof token_error_1.default.InvalidTokenError) {
        return res.status(401).json({ error: err.message });
    }
    // Otros tipos de errores
    return res.status(500).json({ error: "Error interno del servidor" });
});
exports.handleError = handleError;
