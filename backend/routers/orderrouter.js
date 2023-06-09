const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

const { isauthenticated, isautherised } = require("../middleware/auth");

router.route("/order/new").post(isauthenticated, newOrder);

router.route("/order/:id").get(isauthenticated, getSingleOrder);

router.route("/orders/me").get(isauthenticated, myOrders);

router
  .route("/admin/orders")
  .get(isauthenticated, isautherised("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isauthenticated, isautherised("admin"), updateOrder)
  .delete(isauthenticated, isautherised("admin"), deleteOrder);

module.exports = router;