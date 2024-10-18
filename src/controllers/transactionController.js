const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/*

Rollback transaction
ref: 
https://www.prisma.io/docs/concepts/components/prisma-client/transactions

example: 
https://stackoverflow.com/questions/76797453/using-prisma-transaction-how-can-i-insert-record-into-second-table-from-the-firs

Increment and decrement example:
https://stackoverflow.com/questions/69178675/prisma-increase-count-by-1-after-find-query

*/

exports.createTransaction = async (req, res) => {
  try {
    const { sourceAccountId, destinationAccountId, amount } = req.body;

    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Amount must be a positive number and greater than 0");
    }

    // Rollback transaction if any error occurs
    const transaction = await prisma.$transaction(async (tx) => {
      const sourceAccount = await tx.bankAccount.findUnique({
        where: { id: sourceAccountId },
      });
      if (!sourceAccount) {
        throw new Error("Source account not found");
      }

      const destinationAccount = await tx.bankAccount.findUnique({
        where: { id: destinationAccountId },
      });
      if (!destinationAccount) {
        throw new Error("Destination account not found");
      }

      if (sourceAccount.balance < amount) {
        throw new Error("Insufficient funds in source account");
      }

      // Update account balance
      await tx.bankAccount.update({
        where: { id: sourceAccountId },
        data: { balance: { decrement: amount } },
      });
      
      await tx.bankAccount.update({
        where: { id: destinationAccountId },
        data: { balance: { increment: amount } },
      });

      // Create the transaction
      const newTransaction = await tx.transaction.create({
        data: {
          sourceAccountId,
          destinationAccountId,
          amount,
        },
      });
      return newTransaction;
    });
    res.status(201).json({
      statusCode: 201,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(transactionId) },
    });

    if (!transaction) {
      return res.status(404).json({
        statusCode: 404,
        message: "Transaction not found",
      });
    }

    // Rollback transaction if any error occurs
    await prisma.$transaction(async (tx) => {
      // Reverse the transaction
      await tx.bankAccount.update({
        where: { id: transaction.sourceAccountId },
        data: { balance: { increment: transaction.amount } },
      });

      await tx.bankAccount.update({
        where: { id: transaction.destinationAccountId },
        data: { balance: { decrement: transaction.amount } },
      });

      // Delete if transaction is found
      await tx.transaction.delete({
        where: { id: parseInt(transactionId) },
      });
    });

    res.json({
      statusCode: 200,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

exports.getAllTransactions = async (req, res) => {
  const transactions = await prisma.transaction.findMany();
  res.json({
    statusCode: 200,
    message: "Transactions found",
    data: transactions,
  });
};

exports.getTransactionById = async (req, res) => {
  const { transactionId } = req.params;
  const transaction = await prisma.transaction.findUnique({
    where: { id: parseInt(transactionId) },
    include: {
      sourceAccount: { include: { user: true } },
      destinationAccount: { include: { user: true } },
    },
  });
  if (transaction) {
    res.json({
      statusCode: 200,
      message: "Transaction found",
      data: transaction,
    });
  } else {
    res.status(404).json({
      statusCode: 404,
      message: "Transaction not found",
    });
  }
};
