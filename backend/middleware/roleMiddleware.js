const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Not authorized, no user role.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Not authorized, role '${req.user.role}' is not allowed to access this resource.` });
        }
        next();
    };
};

module.exports = { authorizeRoles };