const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8000;

const adminRoutes = require("./routes/admin.route");
const coffeeRoutes = require("./routes/coffee.route");
const orderRoutes = require("./routes/order.route");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "UKL Kelas XI RPL 1 Tahun Ajaran 2023/2024",
  });
});

try {
  app.use("/admin", adminRoutes);
  app.use("/coffee", coffeeRoutes);
  app.use("/order", orderRoutes);
} catch (error) {
  return console.log(error);
}

app.listen(PORT, () => {
  console.log({ message: `App running on port ${PORT}` });
});
