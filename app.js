const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/test', protectedRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
const setupSwaggerDocs = require('./swagger/swagger');

app.get('/', (req, res) => {
  res.send('E-commerce API is running!');
});

app.use('/api/auth', authRoutes);
setupSwaggerDocs(app);
module.exports = app;
