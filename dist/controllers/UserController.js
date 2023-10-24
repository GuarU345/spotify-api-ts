"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const userSchema_1 = require("../schemas/userSchema");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = userSchema_1.userSchema.safeParse(req.body);
    if (result.success === false) {
        return res.status(422).json({ error: JSON.parse(result.error.message) });
    }
    const body = result.data;
    try {
        const newUser = yield UserService_1.UserService.signupService(body);
        res.json(newUser);
    }
    catch (error) {
        next(error);
    }
});
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const token = yield UserService_1.UserService.signinService(body);
        return res.json(token);
    }
    catch (error) {
        next(error);
    }
});
exports.UserController = {
    signup,
    signin,
};
