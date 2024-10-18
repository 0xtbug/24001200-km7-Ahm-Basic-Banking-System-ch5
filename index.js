const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/userRoutes");
const accountRoutes = require("./src/routes/accountRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const app = express();

app.use(bodyParser.json());

// User Routes
app.use("/api/v1/users", userRoutes);

// Account Routes
app.use("/api/v1/accounts", accountRoutes);

// Transaction Routes
app.use("/api/v1/transactions", transactionRoutes);

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
