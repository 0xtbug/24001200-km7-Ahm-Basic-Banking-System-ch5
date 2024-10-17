const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/userRoutes");
const app = express();

app.use(bodyParser.json());

// User Routes
app.use("/api/v1/users", userRoutes);

// TODO: Add routes for Accounts endpoints

// TODO: Add routes for Transactions endpoints

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
