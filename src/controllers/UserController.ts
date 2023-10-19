import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { userSchema } from "../schemas/userSchema";
import InvalidCredentialsError from "../middlewares/errors/user.errors";
import GenericPrismaError from "../middlewares/errors/prisma.errors";

const signup = async (req: Request, res: Response) => {
  const result = userSchema.safeParse(req.body);

  if (result.success === false) {
    return res.status(422).json({ error: JSON.parse(result.error.message) });
  }

  const body = result.data;

  try {
    const newUser = await UserService.signupService(body);
    res.json(newUser);
  } catch (error) {
    if (error instanceof GenericPrismaError) {
      return res.status(404).json({ error: error.message });
    }
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const token = await UserService.signinService(body);
    return res.json(token);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      console.log(error.message);
      return res.json({ message: error.message });
    }
    if (error instanceof GenericPrismaError) {
      return res.status(404).json({ error: error.message });
    }
  }
};

export const UserController = {
  signup,
  signin,
};
