export class InvalidTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTokenError";
  }
}

export class NotAuthorizationTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotAuthorizationTokenError";
  }
}
