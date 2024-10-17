const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

// TODO: add routes for user endpoints

// TODO: Add routes for Accounts endpoints

// TODO: Add routes for Transactions endpoints

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
