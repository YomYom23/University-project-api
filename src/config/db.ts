import "dotenv/config"
import { PrismaClient } from "../../generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({connectionString});

const prisma = new PrismaClient({
    adapter:adapter,
    log: process.env.NODE_ENV === 'development'
         ? ['query', 'error', 'warn'] : ['error']
});

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("DB connected via prisma");
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Database connection error:": ${err.message}`);
            process.exit(1);
        } else {
          console.error("Unknown error occurred during database connection");
        }
    }
}

const disconnectDB = async () => {
    await prisma.$disconnect();
}

export { prisma, connectDB, disconnectDB };