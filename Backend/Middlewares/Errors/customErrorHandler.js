const CustomError = require("../../Helpers/error/CustomError");

const customErrorHandler = (err, req, res, next) => {
    let customError = err;  // Avoid overwriting the original error

    // Handle duplicate field errors (MongoDB error code 11000)
    if (err.code == 11000) {
        customError = new CustomError("Duplicate field value entered", 400); // 400 is more appropriate for this error
    }

    // Handle SyntaxError (e.g., JSON parsing issues)
    if (err.name === 'SyntaxError') {
        customError = new CustomError('Unexpected syntax', 400);
    }

    // Handle validation errors (mongoose validation errors)
    if (err.name === 'ValidationError') {
        customError = new CustomError(err.message, 400);
    }

    // Handle invalid ObjectId errors (e.g., in MongoDB)
    if (err.name === "CastError") {
        customError = new CustomError("Please provide a valid ID", 400);
    }

    // Handle JWT expiration errors
    if (err.name === "TokenExpiredError") {
        customError = new CustomError("JWT expired", 401);
    }

    // Handle malformed JWT errors
    if (err.name === "JsonWebTokenError") {
        customError = new CustomError("JWT malformed", 401);
    }

    // Log the error for debugging
    console.log("Custom Error Handler =>", customError.name, customError.message, customError.statusCode);

    // Send the error response to the client
    return res.status(customError.statusCode || 500)
        .json({
            success: false,
            error: customError.message || "Server Error"
        });
};

module.exports = customErrorHandler;
