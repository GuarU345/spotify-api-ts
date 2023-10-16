import { z } from "zod";
export const artistSchema = z.object({
  name: z
    .string({
      invalid_type_error: "El nombre del artista debe de ser un string",
    })
    .refine((str) => str.length > 1, {
      message: "El nombre del artista deberia de ser mayor de 1 letra",
    }),
  nationality: z.string({
    invalid_type_error: "La nacionalidad del artista debe de ser un string",
  }),
});
