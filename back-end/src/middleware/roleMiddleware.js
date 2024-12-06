const roleMiddleware = (allowedRole) => {
    return (req, res, next) => {
        if (allowedRole !== req.userToken.role) {
            return res
                .status(403)
                .json({ message: "Forbidden: Insufficient permissions" });
        }
        next();
    };
};

module.exports = roleMiddleware;
