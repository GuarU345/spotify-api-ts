import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { userSchema } from "../schemas/userSchema";

const signup = async (req: Request, res: Response) => {
  const result = userSchema.safeParse(req.body);

  if (result.success === false) {
    return res.status(422).json({ error: JSON.parse(result.error.message) });
  }

  const body = result.data;

  try {
    const newUser = await UserService.signupService(body);
    res.json(newUser);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const token = await UserService.signinService(body);
    res.json(token);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

export const UserController = {
  signup,
  signin,
};
