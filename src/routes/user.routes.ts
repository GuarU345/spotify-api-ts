import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

router.post("/api/signup", UserController.signup);
router.post("/api/signin", UserController.signin);

export const userRoutes = router;
