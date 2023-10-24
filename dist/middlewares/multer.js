"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path_1 = require("path");
const storage = multer_1.default.diskStorage({
    destination: "./upload",
    filename: function (req, file, cb) {
        const name = (0, uuid_1.v4)();
        const ext = (0, path_1.extname)(file.originalname);
        cb(null, name + ext);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
