import "dotenv/config"
import jwt from "jsonwebtoken"

export const generateToken = (userId: string, res: any) => {
    const payload = { id: userId };
    const token = jwt.sign(payload, (process.env.JWT_SECRET || "secret"), {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions);

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })

    return token;
}