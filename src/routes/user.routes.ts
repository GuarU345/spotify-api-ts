import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

router.post("/signup", UserController.signup);
router.post("/signin", UserController.signin);

export const userRoutes = router;
