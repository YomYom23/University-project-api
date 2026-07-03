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

const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const { email, userOnboarding } = req.body

    const user = await prisma.user.findUnique({
        where: { id: id as string}
    })

    if(!user) {
        return res.status(400).json({error: "User not found"})
    }
    const updateFields: Record<string, any> = {}
    if (email) { updateFields.email = email }
    if (userOnboarding) {
        updateFields.userOnboarding = {
            update: userOnboarding
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id: id as string },
        data: updateFields
    })

    res.status(200).json({
        status: "success",
        data: updatedUser,
    })

}

export { updateUser }