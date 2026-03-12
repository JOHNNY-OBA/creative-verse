import 'dotenv/config';
import { prisma } from "../lib/db.js";

export const getAllUsers = async (page, limit) => {
  const skip = (page - 1) * limit;

  const [users, totalUsers] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take: limit,
      select: { id: true, email: true, name: true, role: true },
      orderBy: { id: "asc" },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    meta: {
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      limit,
    },
  };
};

export const deleteUserById = async (id) => {
  return await prisma.user.delete({
    where: { id: parseInt(id) },
  });
};

export const updateUserInfo = async (id, data) => {
  return await prisma.user.update({
    where: { id: parseInt(id) },
    data,
    select: { id: true, email: true, name: true, role: true },
  });
};