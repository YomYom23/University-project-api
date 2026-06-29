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
    const { userId,     value } = req.query = req.query

    const user = await prisma.user.findUnique({
        where: { id: userId as string}
    })

    if(!user){
        return res.status(400).json({error: "User not found"})
    }

    let updatedUser;

    if(Array.isArray(field)){
        updatedUser = await prisma.user.update({
            where: { id: userId as string },
            data: {
                [field[0] as string]: {
                    [field[1] as string]: value
                },
            }
            }
        )
    } else {
        updatedUser = await prisma.user.update({
                where: { id: userId as string },
                data: {
                    [field as string]: value,
                }
            }
        )
    }

    return res.status(200).json({
        status: "success",
        data: updatedUser,
    })

}

export { updateUser }