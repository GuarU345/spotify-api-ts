"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidCredentialsError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidCredentialsError";
    }
}
exports.default = InvalidCredentialsError;
