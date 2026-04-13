require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./src/models');
const documentation = require('./src/documentation');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/v1/restaurant', require('./src/routes/restaurantRoutes'));
app.use('/api/v1/menu', require('./src/routes/menuRoutes'));
app.use('/api/v1/reservations', require('./src/routes/reservationRoutes'));
app.use('/api/v1/cart', require('./src/routes/cartRoutes'));
app.use('/api/v1/orders', require('./src/routes/orderRoutes'));
app.use('/api/v1/promotions', require('./src/routes/promotionRoutes'));
app.use('/api/v1/reviews', require('./src/routes/reviewRoutes'));
app.use('/api/v1/reports', require('./src/routes/reportRoutes'));
app.use('/api/v1/payments', require('./src/routes/paymentRoutes'));
app.use('/api/v1/missions', require('./src/routes/mission.router'));
app.use('/api-docs', documentation.swaggerUi.serve, documentation.swaggerUi.setup(documentation.swaggerSpec));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Restaurant service running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});