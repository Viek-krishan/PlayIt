class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    statck = "",
    errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.message = message;
    this.data = null;
    this.success = false;
  }
}

export default ApiError;