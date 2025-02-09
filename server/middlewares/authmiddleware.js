const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ msg: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // decoded contains the payload of the JWT (user information like userId and role).
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decoded);
    // Ensure decoded payload contains the expected `userId`
    if (!decoded || !decoded.userId) {
      return res.status(403).json({ msg: "Invalid token payload" });
    }
    // what it does-It extracts only the userId from the decoded JWT payload and assigns it to req.userId.
    // req.userId = decoded.userId;

    // It assigns the entire decoded payload to req.user, so req.user now contains everything from the JWT
    req.user = decoded;
    // Now, req.user will contain all user details, not just userId but also roles as pass during jwt sign.

    next();
  } catch (e) {
    console.error("JWT Error:", e);
    return res.status(403).json({ msg: "Invalid or expired token" });
  }
};

// to role-based authorization so only receptionists can update appointments
// here requiredRole is just a variable here we pass doctor so it check in req.user.role ===doctor if yes yhen you can access
const authRole = (requiredRoles) => {
  return (req, res, next) => {
    // Check if req.user.role exists and check if it's one of the allowed roles
    if (!req.user || !requiredRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Access denied. You do not have permission." });
    }
    next();
  };
};

module.exports = { authMiddleware, authRole };

//   what this does
// Extracts the token from the request header (Authorization).
// If no token → Rejects request with 401 Unauthorized.
// If token is valid → Decodes user info and attaches it to req.user.
// Calls next() → Allows the request to continue.
