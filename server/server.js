const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/orders', orderRoutes);

// MongoDB Connection
mongoose.connect('mongodb+srv://yehUserName:yehPassword@cluster0.a1b2c3d.mongodb.net/dr-ayurveda-shop')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));   