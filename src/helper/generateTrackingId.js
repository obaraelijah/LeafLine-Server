// Custom ID generation function for tracking number
function generateTrackingId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let customId = '';
    for (let i = 0; i < 8; i++) {
      customId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return `DEX-BDN-${customId}`;
  }