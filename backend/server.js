const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const setSecurityHeaders = require('./middleware/security');
const rateLimit = require('./middleware/rateLimit');

// Load env vars
dotenv.config({ path: './config/.env' });

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');

// Initialize app
const app = express();

// Security headers
app.use(setSecurityHeaders);

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enable CORS
app.use(cors());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/purchases', purchaseRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('EcoFinds API is running...');
});

// Connect to MongoDB
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB Connected');
    })
    .catch((err) => {
      console.error(`MongoDB Connection Error: ${err.message}`);
      console.log('Running without database (some features may not work)');
    });
} else {
  console.log('No MongoDB URI provided - running in demo mode without database');
}

// Error handler middleware (should be after all routes)
app.use(errorHandler);

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});