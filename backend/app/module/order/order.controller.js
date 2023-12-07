const Order = require("./order.model");
const { sendResponse } = require("../../../services/responseService");

/**
 * @desc    Get order lists of customers
 * @route   /api/v1/order/
 * @method  GET
 * @access  Private
 */

exports.orderLists = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 12;
  const skip = (page - 1) * itemsPerPage;

  const [orders, totalOrders] = await Promise.all([
    Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .populate("user"),
    Order.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return sendResponse(res, 200, true, "Order retrieved successfully", {
    orders,
    currentPage: page,
    totalPages,
    nextPage,
    prevPage,
  });
};

/**
 * @desc    Update the status of an order
 * @route   /api/v1/orders/:orderId/update-status
 * @method  PATCH
 * @access  Private
 */

exports.updateOrderStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return sendResponse(res, 404, false, "Order not found");
    }

    // Update the status field
    order.status = newStatus;

    // Save the updated order to the database
    await order.save();
    return sendResponse(
      res,
      200,
      true,
      "Order status updated successfully",
      order
    );
  } catch (error) {
    next(error)
  }
};
