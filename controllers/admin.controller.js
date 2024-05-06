const md5 = require("md5");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminModel = require("../models/index").admin;

exports.createAdmin = async (req, res) => {
  try {
    await adminModel
      .create({
        name: req.body.name,
        email: req.body.email,
        password: md5(req.body.password),
      })
      .then((response) => {
        return res.json({ message: "New admin created" });
      });
  } catch (error) {
    return res.json(error);
  }
};

exports.authAdmin = async (req, res) => {
  try {
    await adminModel
      .findOne({
        where: {
          email: req.body.email,
          password: md5(req.body.password),
        },
      })
      .then(async (response) => {
        if (response) {
          const { createdAt, updatedAt, ...result } = response;
          const token = jwt.sign(result, process.env.SECRET_KEY, {
            expiresIn: "1d",
          });
          return res.json({
            status: true,
            logged: true,
            message: "Login success",
            token,
          });
        } else {
          return res.json({
            status: false,
            logged: false,
            message: "Admin not found",
            token: null,
          });
        }
      })
      .catch((error) => {
        return res.json({
          status: false,
          logged: false,
          message: "Login failed",
          token: null,
        });
      });
  } catch (error) {
    return res.json(error);
  }
};
