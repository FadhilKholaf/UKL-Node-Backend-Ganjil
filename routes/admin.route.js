const adminControllers = require("../controllers/admin.controller");
const express = require("express");
const app = express();

app.use(express.json());

app.post("/create", adminControllers.createAdmin);
app.post("/auth", adminControllers.authAdmin);

module.exports =  app;
