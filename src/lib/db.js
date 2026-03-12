import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: [],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
 
  } catch (error) {

    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();

};

export { prisma, connectDB, disconnectDB };