const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create User
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, profile } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        statusCode: 409,
        message: "User with this email already exists",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        profile: {
          create: profile,
        },
      },
      include: {
        profile: true,
      },
    });
    res.status(201).json({
      statusCode: 201,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password, profile } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { profile: true },
    });

    if (!existingUser) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    const updateData = {
      name,
      email,
      password,
    };

    if (profile && existingUser.profile) {
      updateData.profile = {
        update: profile,
      };
    } else if (profile && !existingUser.profile) {
      updateData.profile = {
        create: profile,
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: updateData,
      include: {
        profile: true,
      },
    });

    res.status(200).json({
      statusCode: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const parsedUserId = parseInt(userId);

    const user = await prisma.user.findUnique({
      where: { id: parsedUserId },
    });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }

    await prisma.profile.deleteMany({
      where: { userId: parsedUserId },
    });

    await prisma.user.delete({
      where: { id: parsedUserId },
    });

    res.status(200).json({
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true },
    });
    res.status(200).json({
      statusCode: 200,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message,
    });
  }
};

// Get User By Id
exports.getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId)
      },
      include: {
        profile: true
      }
    });

    if (user) {
      res.status(200).json({
        statusCode: 200,
        message: "User fetched successfully",
        data: user,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: "Input valid number!",
    });
  }
};
