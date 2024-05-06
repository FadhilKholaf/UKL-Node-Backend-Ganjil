const jwt = require("jsonwebtoken");

exports.authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.json({ message: "Unauthorized" });
    }
    const token = await req.headers.authorization.split(" ");
    try {
      const verified = jwt.verify(token[1], process.env.SECRET_KEY);
      if (!verified) {
        return res.json({ message: "Unauthorized" });
      }
      return next();
    } catch (error) {
      return res.json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.json(error);
  }
};
