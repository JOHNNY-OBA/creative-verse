
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: [],
});  


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in .env — cannot seed admin safely.");
}

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'yes@2021.password';

  
  const hashedPassword = await argon2.hash(adminPassword);

  
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      createdAt: new Date(),
    },
  });

  
  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  console.log('✅ Admin seeded successfully!');
  console.log('Admin details:');
  console.log({
    email: admin.email,
    password: adminPassword, 
    
    createdAt: admin.createdAt,
  });
  console.log('\nJWT token (use this for auth):');
  console.log(token);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });