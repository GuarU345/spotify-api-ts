import EmptyResponseError from "./errors/errors";
import GenericPrismaError from "./errors/prisma.errors";
import InvalidCredentialsError from "./errors/user.errors";

export const handleError = async (err, _req, res, _next) => {
  // Verifica si el error es de tipo InvalidCredentialsError
  if (err instanceof InvalidCredentialsError) {
    return res.status(401).json({ message: err.message });
  }
  if (err instanceof EmptyResponseError) {
    return res.status(200).json({ message: err.message });
  }
  // Verifica si el error es de tipo GenericPrismaError
  if (err instanceof GenericPrismaError) {
    return res.status(500).json({ error: err.message });
  }
  // Otros tipos de errores
  return res.status(500).json({ error: "Error interno del servidor" });
};
