const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 🟢 Customer: New order place karo
router.post('/', async (req, res) => {
  try {
    const orderID = 'AYU-' + Math.floor(10000 + Math.random() * 90000);
    const order = await Order.create({ ...req.body, orderID });
    res.json({ success: true, orderID, message: 'Order placed successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔵 Admin: Saare orders lo
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🟡 Admin: Status update karo
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔴 Admin: Order delete karo
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📊 Admin: Revenue / Analytics
router.get('/stats', async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const paymentBreakdown = {};
    const productBreakdown = {};

    orders.forEach(o => {
      paymentBreakdown[o.payment] = (paymentBreakdown[o.payment] || 0) + o.total;
      o.items.forEach(item => {
        productBreakdown[item.name] = (productBreakdown[item.name] || 0) + (item.qty * item.price);
      });
    });

    res.json({
      success: true,
      totalOrders: orders.length,
      totalRevenue,
      paymentBreakdown,
      productBreakdown
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;   