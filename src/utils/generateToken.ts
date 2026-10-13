import "dotenv/config"
import jwt from "jsonwebtoken"

export const generateToken = (userId: string, res: any) => {
    // No fallback secret: a default would let anyone forge tokens when the
    // variable is missing. Fail loudly instead (authMiddleware does the same).
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in the environment variables!");
    }

    const payload = { id: userId };
    const token = jwt.sign(payload, jwtSecret, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions);

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })

    // login() puts this in its response body; without the return it was undefined.
    return token;
}