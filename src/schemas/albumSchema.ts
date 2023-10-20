import { z } from "zod";

export const albumSchema = z.object({
  name: z.string({
    invalid_type_error: "El nombre del album debe de ser un string",
  }),
  release_date: z
    .string({
      invalid_type_error: "La fecha de lanzamiento debe de ser de tipo fecha",
    })
    .refine(
      (str) => {
        const date = new Date(str);
        return !isNaN(date.getTime());
      },
      {
        message: "La fecha de lanzamiento no es válida en formato ISO 8601",
      }
    ),
  album_image: z
    .string({
      invalid_type_error: "La url del album debe de ser un string",
    })
    .optional(),
});
