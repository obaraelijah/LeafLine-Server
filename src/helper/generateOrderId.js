// Generate a random 15-digit number
function generateOrderId() {
    const randomNumber = Math.floor(Math.random() * 9000000000000000) + 1000000000000000;
    return `#${randomNumber}`;
  }
  exports.generateOrderId = generateOrderId;