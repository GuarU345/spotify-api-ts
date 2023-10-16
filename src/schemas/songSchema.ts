import { z } from "zod";

export const songSchema = z.object({
  name: z.string({
    invalid_type_error: "EL nombre de la cancion debe de ser un string",
  }),
  duration: z
    .string({
      invalid_type_error: "La duracion de la cancion debe de ser un string",
    })
    .refine((duration) => /^[0-5]?[0-9]:[0-5][0-9]$/.test(duration), {
      message: "El formato de la duracion debe de ser HH:MM o MM:SS",
    }),
});
