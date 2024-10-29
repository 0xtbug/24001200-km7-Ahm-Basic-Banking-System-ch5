const express = require("express");
const accountController = require("../controllers/accountController");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * /accounts:
 *   post:
 *     tags:
 *       - Accounts
 *     summary: Create a new bank account
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - userId
 *             - bankName
 *             - bankAccountNumber
 *             - balance
 *           properties:
 *             userId:
 *               type: integer
 *             bankName:
 *               type: string
 *             bankAccountNumber:
 *               type: string
 *             balance:
 *               type: number
 *               minimum: 0
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Account number already exists
 */
router.post("/", authenticateToken, accountController.createAccount);

/**
 * @swagger
 * /accounts/{accountId}:
 *   put:
 *     tags:
 *       - Accounts
 *     summary: Update bank account
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: accountId
 *         in: path
 *         required: true
 *         type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             bankName:
 *               type: string
 *             bankAccountNumber:
 *               type: string
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       404:
 *         description: Account not found
 */
router.put("/:accountId", authenticateToken, accountController.updateAccount);

/**
 * @swagger
 * /accounts/{accountId}:
 *   delete:
 *     tags:
 *       - Accounts
 *     summary: Delete bank account
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: accountId
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: Account not found
 */
router.delete("/:accountId", authenticateToken, accountController.deleteAccount);

/**
 * @swagger
 * /accounts:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Get all bank accounts
 *     description: Retrieve all bank accounts. Requires authentication.
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of bank accounts retrieved successfully
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
router.get("/", authenticateToken, accountController.getAllAccounts);

/**
 * @swagger
 * /accounts/{accountId}:
 *   get:
 *     tags:
 *       - Accounts
 *     summary: Get bank account by ID
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: accountId
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Account details
 *       404:
 *         description: Account not found
 */
router.get("/:accountId", authenticateToken, accountController.getAccountById);

/**
 * @swagger
 * /accounts/{accountId}/deposit:
 *   post:
 *     tags:
 *       - Accounts
 *     summary: Deposit money to account
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: accountId
 *         in: path
 *         required: true
 *         type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - amount
 *           properties:
 *             amount:
 *               type: number
 *               minimum: 0
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Invalid amount
 *       404:
 *         description: Account not found
 */
router.post("/:accountId/deposit", authenticateToken, accountController.depositToAccount);

/**
 * @swagger
 * /accounts/{accountId}/withdraw:
 *   post:
 *     tags:
 *       - Accounts
 *     summary: Withdraw money from account
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: accountId
 *         in: path
 *         required: true
 *         type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - amount
 *           properties:
 *             amount:
 *               type: number
 *               minimum: 0
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: Invalid amount or insufficient funds
 *       404:
 *         description: Account not found
 */
router.post("/:accountId/withdraw", authenticateToken, accountController.withdrawFromAccount);

module.exports = router;
