"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistSchema = void 0;
const zod_1 = require("zod");
exports.artistSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        invalid_type_error: "El nombre del artista debe de ser un string",
    })
        .refine((str) => str.length > 1, {
        message: "El nombre del artista deberia de ser mayor de 1 letra",
    }),
    nationality: zod_1.z.string({
        invalid_type_error: "La nacionalidad del artista debe de ser un string",
    }),
});
