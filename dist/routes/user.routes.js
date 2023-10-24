"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
router.post("/api/signup", UserController_1.UserController.signup);
router.post("/api/signin", UserController_1.UserController.signin);
exports.userRoutes = router;
