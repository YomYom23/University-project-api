import type { Request, Response } from 'express';
import { db } from '../config/db.ts';


const createStudentProfile = async (req: Request, res: Response) => {
    const userId: string = req.query.userId as string;
    const {
        firstName, lastName, age, country, gpa, sat, act, major,
        highSchool, graduationYear, preferredMajors, preferredLocations, size, budgetRange,
    } = req.body;

    //Check if user exists
    const user = await db.orm.public.User
        .where({ id: userId })
        .first()

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
    const { userData, studentData } = req.body;
    const userId = req.user?.id

    const user = await db.orm.public.User
        .where({ id: userId })
        .include("StudentProfile")
        .first()

    if(!user) {
        return res.status(400).json({error: "User not found"})
    }

    if(studentData && !user.studentProfile) {
       await db.orm.public.StudentProfile.create({
           firstName: req.body.studentData.firstName,
       })
    }

    const updateFields: Record<string, any> = Object.fromEntries(
        Object.entries({ ...req.body.userData, ...req.body.studentData, ...req.body.universityData })
            .filter(([field, value]) => value !== undefined)
    )




    if(Object.keys(updateFields).length === 0) {
        return res.status(400).json({error: "No fields provided to update"})
    }

    const updatedUser = await prisma.user.

    res.status(200).json({
        status: "success",
        data: updatedUser,
    })

}

export { updateUser }