import { z } from "zod";
export const playlistSchema = z.object({
  name: z.string({
    invalid_type_error: "El nombre de la playlist debe de ser un string",
  }),
  description: z.string({
    invalid_type_error: "La descripcion debe de ser un string",
  }),
  image: z.string({
    invalid_type_error:
      "La url de la imagen de la playlist debe de ser un string",
  }),
});

export const playlistUpdateSchema = playlistSchema.partial();
