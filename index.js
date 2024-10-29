require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/userRoutes");
const accountRoutes = require("./src/routes/accountRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const authRoutes = require("./src/routes/authRoutes");
const { authenticateToken } = require("./src/middleware/auth");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/swagger');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
