"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playlistUpdateSchema = exports.playlistSchema = void 0;
const zod_1 = require("zod");
exports.playlistSchema = zod_1.z.object({
    name: zod_1.z.string({
        invalid_type_error: "El nombre de la playlist debe de ser un string",
    }),
    description: zod_1.z.string({
        invalid_type_error: "La descripcion debe de ser un string",
    }),
    image: zod_1.z.string({
        invalid_type_error: "La url de la imagen de la playlist debe de ser un string",
    }),
});
exports.playlistUpdateSchema = exports.playlistSchema.partial();
