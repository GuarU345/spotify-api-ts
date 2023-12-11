import { prisma } from "../utils/prisma";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import InvalidCredentialsError from "../middlewares/errors/user.error";
import GenericPrismaError from "../middlewares/errors/prisma.error";
import { User } from "../interfaces/interfaces";
import { PlaylistService } from "./PlaylistService";

const signup = async (body: User) => {
  const { username, email, password } = body;
  try {
    const hashedPassword = await argon2.hash(password);

    const existUsers = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: email,
          },
          {
            username: username,
          },
        ],
      },
    });

    if (existUsers && existUsers.email === email) {
      throw new Error("La cuenta con ese email ya existe");
    } else if (existUsers && existUsers.username === username) {
      throw new Error("El nombre de usuario ya existe");
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    await PlaylistService.createUserLikedSongsPlaylist(newUser.id);

    return newUser;
  } catch (error) {
    throw new GenericPrismaError("Error al intentar registrarte");
  }
};

const signin = async (body: User) => {
  try {
    const { email, password } = body;

    const isRegister = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        tokens: true,
      },
    });

    if (!isRegister || !(await argon2.verify(isRegister.password, password))) {
      throw new InvalidCredentialsError("Credenciales Invalidas");
    }

    const tokenIds = isRegister.tokens.map((token) => token.id);

    if (tokenIds.length > 0) {
      await prisma.token.delete({
        where: {
          id: tokenIds[0],
        },
      });
    }

    const secretKey = process.env.JWT_KEY || "";

    const token = jwt.sign(
      { id: isRegister.id, email: isRegister.email },
      secretKey
    );

    const newToken = await prisma.token.create({
      data: {
        jwtSecretKey: token,
        user_id: isRegister.id,
      },
    });

    return newToken.jwtSecretKey;
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      throw error;
    } else {
      console.error(error);
      throw new GenericPrismaError("No se ha podido iniciar sesion");
    }
  }
};

export const getUserDataByToken = async (bearer: string) => {
  const token = bearer.replace("Bearer", "").trim();
  const userToken = await prisma.token.findFirst({
    where: {
      jwtSecretKey: token,
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id: userToken?.user_id,
    },
  });
  return user?.id;
};

export const UserService = {
  signup,
  signin,
};
