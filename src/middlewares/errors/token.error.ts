class InvalidTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTokenError";
  }
}

class NotAuthorizationTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotAuthorizationTokenError";
  }
}

export default {
  InvalidTokenError,
  NotAuthorizationTokenError,
};
