"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = require("./routes/routes");
const errors_1 = require("./middlewares/errors");
exports.app = (0, express_1.default)();
exports.PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
exports.app.use((0, cors_1.default)());
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use(express_1.default.json());
exports.app.use("/", routes_1.router);
exports.app.use(errors_1.handleError);
