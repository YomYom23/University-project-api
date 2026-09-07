import type { Request, Response } from 'express';
import { db } from '../../prisma/config/db.ts';
import {
    mapStudentProfile,
    mapUserFields,
    missingRequiredFields,
} from './onboardingFields.ts';

const PUBLIC_USER_FIELDS = ["id", "email", "role", "onboardingStep", "createdAt"] as const;

// Every StudentProfile column the onboarding form can fill. Sent back so the
// client can rehydrate a half-finished form.
const PROFILE_SELECTION = [
    "userId", "firstName", "lastName", "dateOfBirth", "country", "phone",
    "gpa", "satScore", "actScore", "highSchool", "graduationYear", "classRank",
    "major", "preferredMajors", "preferredLocations", "preferredRegion", "size",
    "budgetRange", "campusVibes", "extracurriculars", "careerGoals", "priority",
] as const;

// GET /users/me — the signed-in user plus their student profile, so onboarding
// resumes where it left off instead of restarting from empty defaults.
const getCurrentUser = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await db.orm.public.User
        .where({ id: userId })
        .select(...PUBLIC_USER_FIELDS)
        .first();

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const studentProfile = await db.orm.public.StudentProfile
        .where({ userId })
        .select(...PROFILE_SELECTION)
        .first();

    res.status(200).json({
        status: "success",
        data: { user, studentProfile },
    });
};

// PATCH /users — the onboarding save endpoint. Called once per step with
// whatever the form holds so far, so every field is optional and a partial
// payload is the normal case, not an error.
const updateUser = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { userData, studentData } = req.body ?? {};

    const userFields = mapUserFields(userData);
    const studentFields = mapStudentProfile(studentData);
    const hasStudentFields = Object.keys(studentFields).length > 0;

    if (Object.keys(userFields).length === 0 && !hasStudentFields) {
        return res.status(400).json({ error: "No fields provided to update" });
    }

    const existingProfile = await db.orm.public.StudentProfile
        .where({ userId })
        .select("userId")
        .first();

    const { firstName, lastName, dateOfBirth, ...optionalFields } = studentFields;

    // The profile row can only be created once step 0 supplies the three NOT
    // NULL columns. Before that we still persist onboardingStep on its own, so
    // a user who abandons step 0 resumes there rather than losing their place.
    if (!existingProfile && hasStudentFields) {
        const missing = missingRequiredFields(studentFields);

        if (missing.length > 0) {
            return res.status(400).json({
                error: "Complete the first onboarding step before saving further details",
                missingFields: missing,
            });
        }
    }

    const { user, studentProfile } = await db.transaction(async (tx) => {
        const updatedUser = Object.keys(userFields).length > 0
            ? await tx.orm.public.User
                .where({ id: userId })
                .select(...PUBLIC_USER_FIELDS)
                .update(userFields)
            : null;

        if (!hasStudentFields) {
            return { user: updatedUser, studentProfile: null };
        }

        // `update` narrows to the columns present in this step's payload;
        // `create` needs the three required ones, which the guard above has
        // already confirmed are here.
        const updatedProfile = existingProfile
            ? await tx.orm.public.StudentProfile
                .where({ userId })
                .select(...PROFILE_SELECTION)
                .update(studentFields)
            : await tx.orm.public.StudentProfile
                .select(...PROFILE_SELECTION)
                .create({
                    userId,
                    firstName: firstName!,
                    lastName: lastName!,
                    dateOfBirth: dateOfBirth!,
                    ...optionalFields,
                });

        return { user: updatedUser, studentProfile: updatedProfile };
    });

    res.status(200).json({
        status: "success",
        data: { user, studentProfile },
    });
};

export { getCurrentUser, updateUser };
