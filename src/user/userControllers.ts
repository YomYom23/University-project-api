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
    const userId = req.user?.id
    const {
        email, onboardingStep, firstName, lastName,
        dateOfBirth, country, gpa, sat, act, major,
        highSchool, graduationYear, classRank, preferredMajors,
        preferredLocations, size, budgetRange, campusVibes,
        extracurriculars, careerGoal, priority
    } = req.body

    const user = await prisma.user.findUnique({
        where: { id: userId as string}
    })

    if(!user) {
        return res.status(400).json({error: "User not found"})
    }

    const updateFields: Record<string, any> = {}
    if (email) { updateFields.email = email }
    if (firstName) { updateFields.firstName = firstName }
    if (lastName) { updateFields.lastName = lastName }
    if (dateOfBirth) { updateFields.dateOfBirth = dateOfBirth }
    if (country) { updateFields.country = country }
    if (gpa) { updateFields.gpa = gpa }
    if (sat) { updateFields.sat = sat }
    if (act) { updateFields.act = act }
    if (major) { updateFields.major = major }
    if (onboardingStep) {
        updateFields.onboardingStep = onboardingStep > 3 ? null : onboardingStep
    }


    if(Object.keys(updateFields).length === 0) {
        return res.status(400).json({error: "No fields provided to update"})
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId as string },
        data: updateFields,
    })

    res.status(200).json({
        status: "success",
        data: updatedUser,
    })

}

export { updateUser }