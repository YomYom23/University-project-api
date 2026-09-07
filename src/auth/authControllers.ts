import type { Request, Response } from "express"
import { db } from "../../prisma/config/db.ts"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.ts"
import type {UserRole} from "../../generated/prisma/enums.ts";

// Every User field except `password`. The row carries a bcrypt hash and these
// responses are read straight into client state, so the hash must never reach
// the body.
const PUBLIC_USER_FIELDS = ["id", "email", "role", "onboardingStep", "createdAt"] as const;

const registration = async (req: Request, res: Response) => {
    const { email, password, role } = await req.body;

    //Check if user already exists
    const userExists = await db.orm.public.User.where({ email }).select("id").first()

    if(userExists) {
        return res.status(400).json({message: "user already exists"})
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await db.orm.public.User
        .select(...PUBLIC_USER_FIELDS)
        .create({
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
    const user = await db.orm.public.User
        .where({ email })
        .select(...PUBLIC_USER_FIELDS, "password")
        .first()

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

    // The hash was fetched so bcrypt could compare it; drop it before replying.
    const { password: _password, ...publicUser } = user

    res.status(201).json({
        status: "success",
        user: publicUser,
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
    const user = await db.orm.public.User
        .where({ id: req.user?.id })
        .select(...PUBLIC_USER_FIELDS)
        .first()

    if(!user){
        return res.status(401).json({isAuthenticated: false})
    }

    res.status(200).json({
        isAuthenticated: true,
        user: user,
    })

}

export { registration, login, logout, checkAuthStatus}