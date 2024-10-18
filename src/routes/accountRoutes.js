const express = require("express");
const accountController = require("../controllers/accountController");

const router = express.Router();

router.post("/", accountController.createAccount);
router.put("/:accountId", accountController.updateAccount);
router.delete("/:accountId", accountController.deleteAccount);
router.get("/", accountController.getAllAccounts);
router.get("/:accountId", accountController.getAccountById);
router.post("/:accountId/deposit", accountController.depositToAccount);
router.post("/:accountId/withdraw", accountController.withdrawFromAccount);

module.exports = router;
