const coffeeControllers = require("../controllers/coffee.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const express = require("express");
const app = express();

const upload = require("../controllers/upload-coffee-image");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/:search", coffeeControllers.getAllCoffee);
app.post(
  "/",
  upload.single("image"),
  authMiddleware,
  coffeeControllers.createCoffee
);
app.put(
  "/:id",
  upload.single("image"),
  authMiddleware,
  coffeeControllers.updateCoffee
);
app.delete(
  "/:id",
  upload.single("image"),
  authMiddleware,
  coffeeControllers.deleteCoffee
);

module.exports = app;
