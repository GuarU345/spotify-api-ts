class GenericPrismaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GenericPrisma";
  }
}

export default GenericPrismaError;
