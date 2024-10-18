const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      password: 'password123',
      profile: {
        create: {
          identityType: 'KTP',
          identityNumber: '3174052509900001',
          address: 'Jl. Sudirman No. 123, Jakarta Pusat',
        },
      },
    },
    {
      name: 'Siti Rahayu',
      email: 'siti.rahayu@email.com',
      password: 'password456',
      profile: {
        create: {
          identityType: 'KTP',
          identityNumber: '3174052509900002',
          address: 'Jl. Thamrin No. 456, Jakarta Selatan',
        },
      },
    },
  ];

  const createdUsers = await Promise.all(
    users.map(async (user) => {
      return prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          password: user.password,
          profile: {
            update: user.profile.create,
          },
        },
        create: user,
      });
    })
  );

  console.log('Users created or updated:', createdUsers);

  const accounts = [
    {
      userId: createdUsers[0].id,
      bankName: 'Bank Mandiri',
      bankAccountNumber: '1234567890',
      balance: 5000000,
    },
    {
      userId: createdUsers[0].id,
      bankName: 'BCA',
      bankAccountNumber: '0987654321',
      balance: 7500000,
    },
    {
      userId: createdUsers[1].id,
      bankName: 'BNI',
      bankAccountNumber: '1357924680',
      balance: 3000000,
    },
  ];

  const createdAccounts = await Promise.all(
    accounts.map(async (account) => {
      const existingAccount = await prisma.bankAccount.findUnique({
        where: { bankAccountNumber: account.bankAccountNumber },
      });

      if (existingAccount) {
        return prisma.bankAccount.update({
          where: { id: existingAccount.id },
          data: account,
        });
      } else {
        return prisma.bankAccount.create({
          data: account,
        });
      }
    })
  );

  console.log('Bank accounts created or updated:', createdAccounts);

  const transactions = [
    {
      sourceAccountId: createdAccounts[0].id,
      destinationAccountId: createdAccounts[2].id,
      amount: 1000000,
    },
    {
      sourceAccountId: createdAccounts[1].id,
      destinationAccountId: createdAccounts[2].id,
      amount: 500000,
    },
  ];

  const createdTransactions = await Promise.all(
    transactions.map(async (transaction) => {
      return prisma.transaction.create({
        data: transaction,
      });
    })
  );

  console.log('Transactions created:', createdTransactions);

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
