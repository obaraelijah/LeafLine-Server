const asyncHandler = require('express-async-handler');
const Book = require('../book/book.model');
const User = require('../user/user.model');
const Order = require('../order/order.model');
const { sendResponse } = require('../../../services/responseService');

// Get analytics for admin panel
exports.dashboard = asyncHandler(async (req, res) => {
  const total_books = await Book.countDocuments();
  const featured_books = await Book.countDocuments({ featured: true });
  const total_users = await User.countDocuments();
  const total_orders = await Order.countDocuments({
    isPaid: true,
    status: 'Delivered',
  });

  const data = {
    total_orders,
    total_books,
    featured_books,
    total_users,
  };
  return sendResponse(res, 200, true, 'Analytics fetched successfully', data);
});

// Get monthly sales chart data
exports.monthlySales = asyncHandler(async (req, res) => {
  try {
    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date('2023-01-01'), // Start date
            $lte: new Date('2023-12-31'), // End date
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalSales: { $sum: '$totalPrice' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    return sendResponse(res, 200, true, 'Monthly sales fetched successfully', monthlySales);
  } catch (error) {
    console.error('Error fetching last sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
