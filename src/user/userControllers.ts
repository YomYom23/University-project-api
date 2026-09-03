import type { Request, Response } from 'express';
import { db } from '../../prisma/config/db.ts';

const updateUser = async (req: Request, res: Response) => {
    const { userData, studentData, universityData } = req.body;
    const userId = req.user?.id

    const user = await db.orm.public.User
        .where({ id: userId })
        .include("studentProfile")
        .first()

    if(!user) {
        return res.status(400).json({error: "User not found"})
    }

    if(studentData && !user.studentProfile) {
       await db.orm.public.StudentProfile.create({
           firstName: req.body.studentData.firstName,
           lastName: req.body.studentData.lastName,
           dateOfBirth: req.body.studentData.dateOfBirth,
           userId: userId,
       })
    }


    const userFields: Record<string, any> = userData !== undefined ? Object.fromEntries(
        Object.entries(userData)
            .filter(([_, value]) => value !== undefined)
    ) : {}


    const studentFields: Record<string, any> = studentData !== undefined ? Object.fromEntries(
        Object.entries(studentData)
            .filter(([_, value]) => value !== undefined)
    ) : {}


    const universityFields: Record<string, any> = universityData !== undefined ? Object.fromEntries(
        Object.entries(universityData)
            .filter(([_, value]) => value !== undefined)
    ) : {}


    if(Object.keys({...userFields, ...studentFields, ...universityFields}).length === 0) {
        return res.status(400).json({error: "No fields provided to update"})
    }

    const updatedUser = await db.orm.public.User
        .where({ id: userId })
        .updateAll(userFields)

    const updatedStudent = await db.orm.public.StudentProfile
        .where({ userId: userId })
        .updateAll(studentFields)


    res.status(200).json({
        status: "success",
        data: {
            updatedUser,
            updatedStudent,
        },
    })

}

export { updateUser }