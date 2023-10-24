"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidTokenError";
    }
}
class NotAuthorizationTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotAuthorizationTokenError";
    }
}
exports.default = {
    InvalidTokenError,
    NotAuthorizationTokenError,
};
