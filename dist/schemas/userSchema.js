"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    username: zod_1.z
        .string({
        invalid_type_error: "El nombre de usuario debe de ser un string",
    })
        .refine((str) => str.length > 5, {
        message: "EL nombre de usuario debe de ser mayor de 5 caracteres",
    }),
    email: zod_1.z
        .string({
        invalid_type_error: "El correo del usuario debe de ser un string",
    })
        .refine((str) => str.length > 11, {
        message: "El correo debe de ser mayor de 11 caracteres",
    })
        .refine((str) => str.includes("@") && str.includes(".com"), {
        message: "EL correo debe de contener @ y finalizar con .com",
    }),
    password: zod_1.z
        .string({
        invalid_type_error: "La contraseña debe de ser un string",
    })
        .refine((str) => str.length > 5, {
        message: "La contraseña debe de ser mayor de 5 caracteres",
    }),
});
