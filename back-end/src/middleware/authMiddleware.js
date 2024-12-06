const jwt = require('jsonwebtoken');

const authenticateMiddleware = (req, res, next) => {
    const authHeader  = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ statusCode: 401, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userToken = { userId: decoded.userId, role: decoded.role };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = authenticateMiddleware;