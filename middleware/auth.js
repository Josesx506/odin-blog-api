import { passport } from "../config/passport.js";
import { ROLES } from "../config/roles.js";

function authLocalEmail(req,res,next) {
  passport.authenticate("local", (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Authentication failed",
      });
    } else {
        req.user = user;
        next();
    }})(req, res, next);
}

function authLocalEmailCMS(req,res,next) {
  passport.authenticate("local", (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Authentication failed",
      });
    } else if (!['ADMIN', 'AUTHOR'].includes(user.role)) {
      // Prevent users without proper roles from signing in
      return res.status(403).json({ message: 'Access denied' });
    }
    else {
        req.user = user;
        next();
    }})(req, res, next);
}


function authJWT(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ 
        message: info?.message || "Unauthorized: Invalid or expired token"
      });
    } else {
      req.user = user;
      return next();
    }
  })(req, res, next);
}


function authRole(permissions) {
  return (req, res, next) => {
    const userPermissions = ROLES[req.user?.role] || [];
    
    const hasPermission = permissions.some((permission) => {
      return userPermissions.includes(permission);
    });
    if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
}

export { authJWT, authLocalEmail, authLocalEmailCMS, authRole };
