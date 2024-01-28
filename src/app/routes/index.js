// Basic Lib Imports
const express = require('express');

const router = express.Router();

const bookRouters = require('../module/book/book.route');
const userRouters = require('../module/user/user.route');
const authRouters = require('../module/auth/auth.route');
const cartRouters = require('../module/cart/cart.route');
const adminRouters = require('../module/admin/admin.route');
const wishlistRouters = require('../module/wishlist/wishlist.route');
const orderRouters = require('../module/order/order.route');
const reviewRouters = require('../module/review/review.route');
const paymentRouters = require('../module/payment/payment.route');


const moduleRoutes = [
    { path: '/auth', route: authRouters },
    { path: '/users', route: userRouters },
    { path: '/books', route: bookRouters },
    { path: '/cart', route: cartRouters },
    { path: '/wishlist', route: wishlistRouters },
    { path: '/admin', route: adminRouters },
    { path: '/order', route: orderRouters },
    { path: '/payment', route: paymentRouters },
    { path: '/reviews', route: reviewRouters },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

module.exports = applicationRoutes = router;