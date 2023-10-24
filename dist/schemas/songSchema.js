"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.songSchema = void 0;
const zod_1 = require("zod");
exports.songSchema = zod_1.z.object({
    name: zod_1.z.string({
        invalid_type_error: "EL nombre de la cancion debe de ser un string",
    }),
    duration: zod_1.z
        .string({
        invalid_type_error: "La duracion de la cancion debe de ser un string",
    })
        .refine((duration) => /^[0-5]?[0-9]:[0-5][0-9]$/.test(duration), {
        message: "El formato de la duracion debe de ser HH:MM o MM:SS",
    }),
});
