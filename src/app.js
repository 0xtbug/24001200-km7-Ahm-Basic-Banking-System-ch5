const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");
const { authenticateToken } = require("./middleware/auth");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();

app.use(bodyParser.json());

// Auth Routes (public)
app.use("/api/v1/auth", authRoutes);

// Protected Routes
app.use("/api/v1/users", authenticateToken, userRoutes);
app.use("/api/v1/accounts", authenticateToken, accountRoutes);
app.use("/api/v1/transactions", authenticateToken, transactionRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Test route for 500 error (for testing purposes)
if (process.env.NODE_ENV === 'test') {
  app.get('/api/v1/test-error', (req, res, next) => {
    throw new Error('Test error');
  });
}

// Error handler
// 404
app.use((req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    message: "Are you lost?",
  });
});

// 500
app.use((err, req, res, next) => {
  res.status(500).json({
    statusCode: 500,
    message: err.message,
  });
});

module.exports = app; 