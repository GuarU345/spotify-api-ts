import EmptyResponseError from "./errors/empty.error";
import GenericPrismaError from "./errors/prisma.error";
import InvalidCredentialsError from "./errors/user.error";
import {
  InvalidTokenError,
  NotAuthorizationTokenError,
} from "./errors/token.error";
import { Errback, NextFunction, Request, Response } from "express";

export const handleError = async (
  err: Errback,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Verifica si el error es de tipo InvalidCredentialsError
  if (err instanceof InvalidCredentialsError) {
    return res.status(401).json({ message: err.message });
  }
  if (err instanceof EmptyResponseError) {
    return res.status(404).json({ message: err.message });
  }
  // Verifica si el error es de tipo GenericPrismaError
  if (err instanceof GenericPrismaError) {
    return res.status(500).json({ error: err.message });
  }
  if (err instanceof NotAuthorizationTokenError) {
    return res.status(500).json({ error: err.message });
  }
  if (err instanceof InvalidTokenError) {
    return res.status(401).json({ error: err.message });
  }
  // Otros tipos de errores
  return res.status(500).json({ error: "Error interno del servidor" });
};
