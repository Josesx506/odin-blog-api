class PrismaCustomError extends Error {
    constructor(message, code) {
      super(message);
      this.name = "PrismaCustomError";
      this.code = code;
    }
}

export { PrismaCustomError }