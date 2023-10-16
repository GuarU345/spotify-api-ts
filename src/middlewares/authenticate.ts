import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new Error("No cabecera");
    }

    const token = header.replace("Bearer ", "");

    const tokenExist = await prisma.token.findFirst({
      where: {
        jwtSecretKey: token,
      },
    });

    if (!tokenExist) {
      throw new Error("Token Invalido");
    }

    jwt.verify(token, process.env.JWT_KEY || "");
    next();
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
};
