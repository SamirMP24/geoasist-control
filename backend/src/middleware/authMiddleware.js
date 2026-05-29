const jwt = require("jsonwebtoken");

require("dotenv").config();

const verifyToken = (req, res, next) => {

  try {

    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {

      return res.status(403).json({
        message: "Token requerido"
      });
    }

    const token = bearerHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Token inválido"
    });
  }
};

module.exports = verifyToken;