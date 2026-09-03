import "dotenv/config"
import { db } from "../../prisma/config/db.ts"

const connectDB = async () => {
    try {
        await db.orm.public.User.first();
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
    await db.close();
}

export { db, connectDB, disconnectDB };