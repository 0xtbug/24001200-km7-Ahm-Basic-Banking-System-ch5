const express = require("express");
const transactionsController = require("../controllers/transactionController");

const router = express.Router();

router.post("/", transactionsController.createTransaction);
router.delete('/:transactionId', transactionsController.deleteTransaction);
router.get("/", transactionsController.getAllTransactions);
router.get("/:transactionId", transactionsController.getTransactionById);

module.exports = router;
