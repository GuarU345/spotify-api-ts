import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import {
  NotAuthorizationTokenError,
  InvalidTokenError,
} from "./errors/token.error";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new NotAuthorizationTokenError("No cabecera");
    }

    const token = header.replace("Bearer ", "");

    const tokenExist = await prisma.token.findFirst({
      where: {
        jwtSecretKey: token,
      },
    });

    if (!tokenExist) {
      throw new InvalidTokenError("Token Invalido");
    }

    jwt.verify(token, process.env.JWT_KEY || "");
    next();
  } catch (error) {
    next(error);
  }
};
