import type { Request, Response } from "express"
import { prisma } from "../config/db.ts"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.ts"
import type {UserRole} from "../../generated/prisma/enums.ts";

const registration = async (req: Request, res: Response) => {
    const { email, password, role } = await req.body;

    //Check if user already exists
    const userExists = await prisma.user.findUnique({
        where: { email }
    })

    if(userExists) {
        return res.status(400).json({message: "user already exists"})
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role as UserRole,
        }
    })

    const token = generateToken(user.id, res)

    res.status(201).json({
        status: "success",
        data: {
            user,
            token,
        }
    });
}

const login = async (req: Request, res: Response) => {
    const { email, password } = await req.body;

    //Check if user exists
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if(!user) {
        return res.status(400).json({message: "Invalid email or password"})
    }

    //Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        return res.status(400).json({message: "Invalid email or password"})
    }

    //Generate JWT Token
    const token = generateToken(user.id, res)

    res.status(201).json({
        status: "success",
        user,
        token,
    })
}

const logout = async (req: Request, res: Response) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    })
}

const checkAuthStatus = async (req: Request ,res: Response) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
    })

    if(!user){
        return res.status(401).json({isAuthenticated: false})
    }

    res.status(200).json({
        isAuthenticated: true,
        user: user,
    })

}

export { registration, login, logout, checkAuthStatus}