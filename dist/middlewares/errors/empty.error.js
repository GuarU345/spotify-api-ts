"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmptyResponseError extends Error {
    constructor(message) {
        super(message);
        this.name = "EmptyResponse";
    }
}
exports.default = EmptyResponseError;
