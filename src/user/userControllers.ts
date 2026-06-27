import type { Request, Response } from 'express';
import { prisma } from '../config/db.ts';


const createStudentProfile = async (req: Request, res: Response) => {
    const userId: string = req.query.userId as string;
    const {
        firstName, lastName, age, country, gpa, sat, act, major,
        highSchool, graduationYear, preferredMajors, preferredLocations, size, budgetRange,
    } = req.body;

    //Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    if(!user) {
        return res.status(400).json({error: "User not found"})
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            firstName, lastName, age, country, gpa, sat, act, major,
            highSchool, graduationYear, preferredMajors, preferredLocations, size, budgetRange,
        }
    })


};