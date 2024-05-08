const path = require("path");
const { Op } = require("sequelize");
const fs = require("fs");
const coffeeModel = require("../models/index").coffee;

exports.createCoffee = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({
        status: false,
        data: { error: "Please upload a single file" },
        message: "Coffee not created",
      });
    }
    await coffeeModel
      .create({
        name: req.body.name,
        size: req.body.size,
        price: req.body.price,
        image: req.file.filename,
      })
      .then((result) => {
        return res.json({
          status: true,
          data: result,
          message: "Coffee has created",
        });
      })
      .catch((err) => {
        return res.json({
          status: false,
          data: err,
          message: "Coffee not created",
        });
      });
  } catch (error) {
    return res.json(error);
  }
};

exports.updateCoffee = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({
        status: false,
        data: { error: "Please upload a single file" },
        message: "Coffee not updated",
      });
    }
    if (req.file) {
      const existingCoffee = await coffeeModel.findOne({
        where: { id: req.params.id },
      });
      if (!existingCoffee) {
        return res.json({
          status: false,
          data: { error: "No such coffee" },
          message: "Coffee not updated",
        });
      }
      // const pathImage = path.join(
      //   __dirname,
      //   "../uploads",
      //   existingCoffee.image
      // );
      // if (fs.existsSync(pathImage)) {
      //   fs.unlink(pathImage);
      // }
    }
    await coffeeModel
      .update(
        {
          name: req.body.name,
          size: req.body.size,
          price: req.body.price,
          image: req.file.filename,
        },
        { where: { id: req.params.id } }
      )
      .then(async (result) => {
        return res.json({
          status: true,
          data: await coffeeModel.findOne({ where: { id: req.params.id } }),
          message: "Coffee has updated",
        });
      })
      .catch((err) => {
        return res.json({
          status: false,
          data: err,
          message: "Coffee not updated",
        });
      });
  } catch (error) {
    return res.json(error);
  }
};

exports.deleteCoffee = async (req, res) => {
  try {
    const coffee = await coffeeModel.findOne({ where: { id: req.params.id } });
    if (!coffee) {
      return res.json({
        status: false,
        data: { error: "No such coffee" },
        message: "Coffee not deleted",
      });
    }
    const pathImage = path.join(__dirname, "../uploads", coffee.image);
    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage);
    }
    await coffeeModel
      .destroy({ where: { id: req.params.id } })
      .then((result) => {
        return res.json({
          status: true,
          data: coffee,
          message: "Coffee has deleted",
        });
      })
      .catch((err) => {
        return res.json({
          status: false,
          data: err,
          message: "Coffee not deleted",
        });
      });
  } catch (error) {
    return res.json(error);
  }
};

exports.getAllCoffee = async (req, res) => {
  try {
    if (req.params) {
      await coffeeModel
        .findAll({
          where: {
            [Op.or]: {
              name: { [Op.substring]: req.params.search },
              size: { [Op.substring]: req.params.search },
              price: { [Op.substring]: req.params.search },
            },
          },
        })
        .then((result) => {
          return res.json({
            status: true,
            data: result,
            message: "Coffee has retrieved",
          });
        })
        .catch((err) => {
          return res.json(err);
        });
    }
  } catch (error) {
    return res.json(error);
  }
};

exports.getCoffeeImage = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Server Error" });
    }
  });
};
