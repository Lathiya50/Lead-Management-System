const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/auth");
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  getOrderStats,
} = require("../controllers/orderController");

router.use(protect);

router.get("/stats", getOrderStats);

router.route("/").get(getOrders).post(createOrder);

router.route("/:id").get(getOrder).put(updateOrder);

module.exports = router;
