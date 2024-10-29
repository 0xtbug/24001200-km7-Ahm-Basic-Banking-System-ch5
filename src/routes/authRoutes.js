const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account with profile information
 *     produces:
 *       - application/json
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
 *         description: User registered successfully
 *       409:
 *         description: User with this email already exists
 *       400:
 *         description: Invalid input
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticate user and return token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/authenticate:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Verify JWT token
 *     description: Verify the JWT token and get user information
 *     produces:
 *       - application/json
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         schema:
 *           type: object
 *           properties:
 *             statusCode:
 *               type: integer
 *             message:
 *               type: string
 *             data:
 *               type: object
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
router.get("/authenticate", authController.authenticate);

module.exports = router; 