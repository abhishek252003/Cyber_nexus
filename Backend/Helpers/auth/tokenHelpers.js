const isTokenIncluded = (req) => {
    return (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    );
};

const getAccessTokenFromHeader = (req) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        throw new Error("Invalid Authorization header format");
    }

    const access_token = req.headers.authorization.split(" ")[1];
    if (!access_token) {
        throw new Error("Token not found in Authorization header");
    }

    return access_token;
};

const sendToken = (user, statusCode, res) => {
    try {
        if (!user.generateJwtFromUser) {
            throw new Error("Token generation method not found");
        }

        const token = user.generateJwtFromUser(); // Generates JWT from user instance
        return res.status(statusCode).json({
            success: true,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error generating token",
        });
    }
};

module.exports = {
    sendToken,
    isTokenIncluded,
    getAccessTokenFromHeader,
};
