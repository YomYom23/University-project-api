import "dotenv/config"
import jwt, {type JwtPayload} from "jsonwebtoken"
import { prisma } from "../config/db.ts"
import type { Request, Response, NextFunction } from "express"


// Check if token is valid
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Get token from header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) { // Get token from cookie
        token = req.cookies.jwt;
    }

    // Handle unauthorized request
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in the environment variables!");
    }

    try{
        // Verify token and extract the user id
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return res.status(401).json({ error: "user no longer exists" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unknown error" });
    }
}