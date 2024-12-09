const CustomError = require("../../Helpers/error/CustomError");
const User = require("../../Models/user");
const jwt = require("jsonwebtoken");
const asyncErrorWrapper = require("express-async-handler");
const { isTokenIncluded, getAccessTokenFromHeader } = require("../../Helpers/auth/tokenHelpers");

const getAccessToRoute = asyncErrorWrapper(async (req, res, next) => {
    const { JWT_SECRET_KEY } = process.env;

    if (!JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined in environment variables");
    }

    if (!isTokenIncluded(req)) {
        return next(new CustomError("You are not authorized to access this route", 401));
    }

    const accessToken = getAccessTokenFromHeader(req);

    let decoded;
    try {
        decoded = jwt.verify(accessToken, JWT_SECRET_KEY);
    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return next(new CustomError("JWT malformed", 401));
        }
        if (err.name === "TokenExpiredError") {
            return next(new CustomError("JWT expired", 401));
        }
        return next(new CustomError("Unauthorized access", 401));
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        return next(new CustomError("You are not authorized to access this route", 401));
    }

    req.user = user;
    next();
});

module.exports = { getAccessToRoute };
