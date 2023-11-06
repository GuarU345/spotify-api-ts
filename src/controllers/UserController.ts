import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { userSchema } from "../schemas/userSchema";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const result = userSchema.safeParse(req.body);

  if (result.success === false) {
    return res.status(422).json({ error: JSON.parse(result.error.message) });
  }

  const body = result.data;

  try {
    const newUser = await UserService.signup(body);
    res.json(newUser);
  } catch (error) {
    next(error);
  }
};

const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const token = await UserService.signin(body);
    return res.json(token);
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  signup,
  signin,
};
