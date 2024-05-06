const orderControllers = require("../controllers/order.controller");
const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const app = express();

app.use(express.json());

app.post("/", orderControllers.createOrder);

app.get("/",authMiddleware,orderControllers.getOrderHistory)

module.exports =  app;