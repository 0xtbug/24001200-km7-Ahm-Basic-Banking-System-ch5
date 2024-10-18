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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
