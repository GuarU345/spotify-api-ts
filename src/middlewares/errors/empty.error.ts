class EmptyResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmptyResponse";
  }
}

export default EmptyResponseError;
