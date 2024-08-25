const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const db = require("../models");

// Middleware untuk verifikasi token statis
const verifyStaticToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  const expectedToken = config.secret; // Token yang diambil dari .env

  if (!token || token !== expectedToken) {
    return res.status(403).send({ message: "Invalid token!" });
  }

  // Token valid, lanjutkan ke middleware berikutnya
  next();
};

// Middleware untuk validasi UserId
const verifyUserId = async (req, res, next) => {
  const userId = req.body.userId;
  if (!userId) {
    return res.status(400).send({ message: "UserId is required in the body!" });
  }

  try {
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Error checking userId:', error);
    res.status(500).send({ message: "Error checking userId." });
  }
};

// Middleware untuk memeriksa role
const checkRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.userId) {
        return res.status(400).send({ message: "UserId is not set in request!" });
      }

      // Find UserRoles for the given userId
      const userRoles = await db.UserRole.findAll({
        where: { userId: req.userId },
        attributes: ['roleId'] // Only select roleId
      });

      // Extract roleIds
      const roleIds = userRoles.map(ur => ur.roleId);

      if (roleIds.length === 0) {
        return res.status(403).send({ message: "User has no roles!" });
      }

      // Find Roles based on roleIds
      const roles = await db.Role.findAll({
        where: { id: roleIds },
        attributes: ['name'] // Select only name
      });

      // Extract role names
      const roleNames = roles.map(role => role.name);

      // Check if user has any of the required roles
      const hasRole = requiredRoles.some(role => roleNames.includes(role));

      if (!hasRole) {
        return res.status(403).send({ message: "Forbidden: You don't have the required role!" });
      }

      next();
    } catch (error) {
      console.error('Error checking role:', error);
      res.status(500).send({ message: "Failed to authenticate role." });
    }
  };
};

module.exports = { verifyStaticToken, verifyUserId, checkRole };