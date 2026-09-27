const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderID: { type: String, unique: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, required: true },
    city: { type: String, required: true }
  },
  items: [{
    name: String,
    qty: Number,
    price: Number
  }],
  total: { type: Number, required: true },
  payment: { type: String, required: true }, // UPI / PhonePe / GPay / Paytm / COD
  status: {
    type: String,
    enum: ['Ordered', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Ordered'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);   