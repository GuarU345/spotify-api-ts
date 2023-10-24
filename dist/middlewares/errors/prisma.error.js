"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenericPrismaError extends Error {
    constructor(message) {
        super(message);
        this.name = "GenericPrismaError";
    }
}
exports.default = GenericPrismaError;
