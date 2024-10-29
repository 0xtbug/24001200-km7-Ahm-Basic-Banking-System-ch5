const express = require("express");
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Retrieve all users. Requires authentication.
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - email
 *             - password
 *             - profile
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             profile:
 *               type: object
 *               properties:
 *                 identityType:
 *                   type: string
 *                 identityNumber:
 *                   type: string
 *                 address:
 *                   type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
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
router.post("/", authenticateToken, userController.createUser);

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user
 *     description: Retrieve all users. Requires authentication.
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             profile:
 *               type: object
 *               properties:
 *                 identityType:
 *                   type: string
 *                 identityNumber:
 *                   type: string
 *                 address:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
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
router.put("/:userId", authenticateToken, userController.updateUser);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user
 *     description: Retrieve all users. Requires authentication.
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
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
router.delete("/:userId", authenticateToken, userController.deleteUser);

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve all users. Requires authentication.
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
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
router.get("/", authenticateToken, userController.getAllUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve all users. Requires authentication.
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
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
router.get("/:userId", authenticateToken, userController.getUser);

module.exports = router;
