const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Account
exports.createAccount = async (req, res) => {
  try {
    const { userId, bankName, bankAccountNumber, balance } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    if (typeof balance !== "number" || balance <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Balance must be a positive number and greater than 0",
      });
    }

    const existingAccount = await prisma.bankAccount.findFirst({
      where: { bankAccountNumber },
    });

    if (existingAccount) {
      return res.status(409).json({
        statusCode: 409,
        message: "An account with this bank account number already exists",
      });
    }

    const newAccount = await prisma.bankAccount.create({
      data: {
        userId: parseInt(userId),
        bankName,
        bankAccountNumber,
        balance,
      },
    });
    res.status(201).json({
      statusCode: 201,
      message: "Account created successfully",
      data: newAccount,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

// Update Account
exports.updateAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { bankName, bankAccountNumber } = req.body;

    const existingAccount = await prisma.bankAccount.findUnique({
      where: { id: parseInt(accountId) },
    });

    if (!existingAccount) {
      return res.status(404).json({
        statusCode: 404,
        message: "Account not found",
      });
    }

    if (
      bankAccountNumber &&
      bankAccountNumber !== existingAccount.bankAccountNumber
    ) {
      const duplicateAccount = await prisma.bankAccount.findFirst({
        where: { bankAccountNumber },
      });

      if (duplicateAccount) {
        return res.status(409).json({
          statusCode: 409,
          message: "An account with this bank account number already exists",
        });
      }
    }

    const updatedAccount = await prisma.bankAccount.update({
      where: { id: parseInt(accountId) },
      data: {
        bankName: bankName || existingAccount.bankName,
        bankAccountNumber:
          bankAccountNumber || existingAccount.bankAccountNumber,
      },
    });

    res.json({
      statusCode: 200,
      message: "Account updated successfully",
      data: updatedAccount,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    const existingAccount = await prisma.bankAccount.findUnique({
      where: { id: parseInt(accountId) },
    });

    if (!existingAccount) {
      return res.status(404).json({
        statusCode: 404,
        message: "Account not found",
      });
    }

    await prisma.bankAccount.delete({
      where: { id: parseInt(accountId) },
    });

    res.json({
      statusCode: 200,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

// Get All Accounts
exports.getAllAccounts = async (req, res) => {
  const accounts = await prisma.bankAccount.findMany();
  res.json({
    statusCode: 200,
    message: "Accounts fetched successfully",
    data: accounts,
  });
};

// Get Account By Id
exports.getAccountById = async (req, res) => {
  const { accountId } = req.params;
  const account = await prisma.bankAccount.findUnique({
    where: { id: parseInt(accountId) },
    include: { user: true },
  });
  if (account) {
    res.json({
      statusCode: 200,
      message: "Account fetched successfully",
      data: account,
    });
  } else {
    res.status(404).json({
      statusCode: 404,
      message: "Account not found",
    });
  }
};

// Deposit to Account
exports.depositToAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { amount } = req.body;

    const account = await prisma.bankAccount.findUnique({
      where: { id: parseInt(accountId) },
    });
    if (!account) {
      return res.status(404).json({
        statusCode: 404,
        message: "Account not found",
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Amount must be a positive number and greater than 0",
      });
    }

    const updatedAccount = await prisma.bankAccount.update({
      where: { id: parseInt(accountId) },
      data: { balance: { increment: amount } },
    });
    res.json({
      statusCode: 200,
      message: "Deposit successfully",
      data: updatedAccount,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

// Withdraw from Account
exports.withdrawFromAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { amount } = req.body;

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Amount must be a positive number and greater than 0",
      });
    }

    const account = await prisma.bankAccount.findUnique({
      where: { id: parseInt(accountId) },
    });
    if (!account) {
      return res.status(404).json({
        statusCode: 404,
        message: "Account not found",
      });
    }

    if (account.balance < amount) {
      return res.status(400).json({
        statusCode: 400,
        message: "Insufficient funds",
      });
    }

    const updatedAccount = await prisma.bankAccount.update({
      where: { id: parseInt(accountId) },
      data: { balance: { decrement: amount } },
    });
    res.json({
      statusCode: 200,
      message: "Withdraw successfully",
      data: updatedAccount,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};
