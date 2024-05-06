const orderListModel = require("../models/index").order_list;
const orderDetailModel = require("../models/index").order_detail;
const coffeeModel = require("../models/index").coffee;

exports.createOrder = async (req, res) => {
  try {
    await orderListModel
      .create({
        customer_name: req.body.customer_name,
        order_type: req.body.order_type,
        order_date: req.body.order_date,
      })
      .then(async (result) => {
        console.log(result,req.body);
        req.body.order_detail.map(async (item) => {
          const coffee = await coffeeModel.findOne({
            where: { id: item.coffee_id },
          });
          await orderDetailModel.create({
            order_id: result.id,
            price: coffee.price * item.quantity,
            ...item,
          });
        });
        return res.json({
          status: true,
          data: result,
          message: "Order list has created",
        });
      })
      .catch((err) => {});
  } catch (error) {
    return res.json(error);
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    await orderListModel
      .findAll({
        include: { model: orderDetailModel, include: { model: coffeeModel } },
      })
      .then((result) => {
        return res.json({
          status: true,
          data: result,
          message: "Order list has been retrieved",
        });
      })
      .catch((err) => {
        return res.json(err);
      });
  } catch (error) {
    return res.json(error);
  }
};
