const Cart = require("./cart.model");
const Book = require("../book/book.model");
const asyncHandler = require("express-async-handler");
const { sendResponse } = require("../../../services/responseService");

/**
 * @desc    Get user's cart
 * @route   /api/v1/cart/
 * @method  GET
 * @access  Private
 */
exports.getCartItems = async (req, res, next) => {
  const userId = req.user.id;

  try {
    // Find all cart items for the user
    const cart = await Cart.find({ user: userId }).populate("items.book");

    if (cart.length === 0) {
      return sendResponse(res, 404, false, "Your cart is empty");
    }

    return sendResponse(
      res,
      200,
      true,
      "Cart items retrieved successfully",
      cart
    );
  } catch (error) {
    next(error)
  }
};

/**
 * @desc    Add item to the cart
 * @route   /api/v1/cart/add
 * @method  POST
 * @access  Private
 */

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    const book = await Book.findById(productId);

    if (!book) {
      return sendResponse(res, 404, false, "Book not found");
    }

    if (!cart) {
      // If the user doesn't have a cart yet, create a new one
      cart = new Cart({ user: userId });
    }

    // Check if the book already exists in the cart
    const existingCartItem = cart.items.find((item) =>
      item.book.equals(productId)
    );

    if (existingCartItem) {
      // If the book already exists, update the quantity
      existingCartItem.quantity += quantity;
      existingCartItem.subTotal = Math.round(
        book.price * existingCartItem.quantity
      );
      existingCartItem.totalPrice = Math.round(
        book.price * existingCartItem.quantity +
          book.shippingFees * existingCartItem.quantity
      );
    } else {
      // If the book doesn't exist in the cart, create a new cart item
      const newCartItem = {
        book: book._id,
        quantity: quantity,
        shippingFees: book.shippingFees,
        subTotal: Math.round(book.price * quantity),
        totalPrice: Math.round(book.price * quantity + book.shippingFees),
      };
      cart.items.push(newCartItem);
    }

    // Calculate the total price for the entire cart based on the items
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.totalPrice;
    }, 0);

    await cart.save();

    return sendResponse(res, 200, true, "Item added to cart successfully");
  } catch (error) {
    next(error)
  }
});

/**
 * @desc    Remove item from the cart
 * @route   /api/v1/cart/remove/:productId
 * @method  DELETE
 * @access  Private
 */
exports.removeItemFromCart = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return sendResponse(res, 404, false, "Your cart is empty");
    }

    // Find the index of the item to be removed
    const itemIndex = cart.items.findIndex((item) =>
      item.book.equals(productId)
    );

    if (itemIndex === -1) {
      return sendResponse(res, 404, false, "Item not found in cart");
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);
    await cart.save();
    return sendResponse(res, 200, true, "Item removed from cart");
  } catch (error) {
    next(error)
  }
};

/**
 * @desc    Remove all items from the cart
 * @route   /api/v1/cart/remove-all
 * @method  DELETE
 * @access  Private
 */
exports.removeAllItemsFromCart = async (req, res, next) => {
  const userId = req.user.id;

  try {
    // Find and remove the user's cart
    await Cart.deleteOne({ user: userId });

    return sendResponse(
      res,
      200,
      true,
      "All items removed from the cart successfully"
    );
  } catch (error) {
    next(error)
  }
};

/**
 * @desc   Update the quantity of a cart item
 * @route  /api/v1/cart/updateQuantity
 * @method PUT
 * @access Private
 */
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { cartItemId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return sendResponse(res, 404, false, "Cart not found");
    }

    // Find the cart item by its ID
    const cartItem = cart.items.find((item) => item._id.equals(cartItemId));

    if (!cartItem) {
      return sendResponse(res, 404, false, "Cart item not found");
    }

    // Update the quantity of the cart item
    cartItem.quantity = quantity;
    cartItem.totalPrice = cartItem.book.price * quantity;

    await cart.save();

    return sendResponse(
      res,
      200,
      true,
      "Cart item quantity updated successfully"
    );
  } catch (error) {
    next(error)
  }
});
