const express = require("express");
const transactionsController = require("../controllers/transactionController");
const router = express.Router();

/**
 * @swagger
 * /transactions:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Create a new transaction
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - sourceAccountId
 *             - destinationAccountId
 *             - amount
 *           properties:
 *             sourceAccountId:
 *               type: integer
 *             destinationAccountId:
 *               type: integer
 *             amount:
 *               type: number
 *               minimum: 0
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid input or insufficient funds
 *       404:
 *         description: Account not found
 */
router.post("/", transactionsController.createTransaction);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   delete:
 *     tags:
 *       - Transactions
 *     summary: Delete transaction
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: transactionId
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 */
router.delete('/:transactionId', transactionsController.deleteTransaction);

/**
 * @swagger
 * /transactions:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get all transactions
 *     description: Retrieve all transactions. Requires authentication.
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of transactions retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             statusCode:
 *               type: integer
 *             message:
 *               type: string
 *             data:
 *               type: array
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         schema:
 *           type: object
 *           properties:
 *             statusCode:
 *               type: integer
 *             message:
 *               type: string
 */
router.get("/", transactionsController.getAllTransactions);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get transaction by ID
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: transactionId
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 */
router.get("/:transactionId", transactionsController.getTransactionById);

module.exports = router;
