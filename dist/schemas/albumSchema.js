"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.albumSchema = void 0;
const zod_1 = require("zod");
exports.albumSchema = zod_1.z.object({
    name: zod_1.z.string({
        invalid_type_error: "El nombre del album debe de ser un string",
    }),
    release_date: zod_1.z
        .string({
        invalid_type_error: "La fecha de lanzamiento debe de ser de tipo fecha",
    })
        .refine((str) => {
        const date = new Date(str);
        return !isNaN(date.getTime());
    }, {
        message: "La fecha de lanzamiento no es válida en formato ISO 8601",
    }),
    album_image: zod_1.z
        .string({
        invalid_type_error: "La url del album debe de ser un string",
    })
        .optional(),
});
