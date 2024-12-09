class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }

    // Helper methods
    static BadRequest(message = "Bad Request") {
        return new CustomError(message, 400);
    }

    static NotFound(message = "Resource Not Found") {
        return new CustomError(message, 404);
    }

    static Unauthorized(message = "Unauthorized Access") {
        return new CustomError(message, 401);
    }
}

module.exports = CustomError;
