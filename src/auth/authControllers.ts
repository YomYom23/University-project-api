import type { Request, Response } from "express"
import { db } from "../../prisma/config/db.ts"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.ts"
import type {UserRole} from "../../generated/prisma/enums.ts";

const registration = async (req: Request, res: Response) => {
    const { email, password, role } = await req.body;

    //Check if user already exists
    const userExists = await db.orm.public.User.where({ email }).first()

    if(userExists) {
        return res.status(400).json({message: "user already exists"})
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await db.orm.public.User.create({
        email,
        password: hashedPassword,
        role: role as UserRole,
    })


    generateToken(user.id, res)

    res.status(201).json({
        status: "success",
        data: {
            user,
        }
    });
}

const login = async (req: Request, res: Response) => {
    const { email, password } = await req.body;

    //Check if user exists
    const user = await db.orm.public.User.where({ email }).first()

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
    const user = await db.orm.public.User.where({ id: req.user?.id }).first()

    if(!user){
        return res.status(401).json({isAuthenticated: false})
    }

    res.status(200).json({
        isAuthenticated: true,
        user: user,
    })

}

export { registration, login, logout, checkAuthStatus}