// Translates the onboarding form's payload into StudentProfile columns.
//
// Nothing here is a plain copy, because the form and the table disagree in
// three ways: names differ (careerGoal/careerGoals, act/actScore), types
// differ (graduationYear is a number in the form and text in the table, and
// the number inputs arrive as strings), and the form's size labels are
// title-case while CampusSize is upper-case.
//
// The form also collects fields the table has no column for — gpaScale,
// submittingScores, settingPreference, distanceTolerance, needsFinancialAid,
// supportNeeds, riskTolerance. Those are dropped here rather than passed
// through, so an unmapped key can never reach the database.

// Type-only import, so it resolves against the emitted contract.d.ts the same
// way prisma/config/db.ts does.
import type { FieldOutputTypes } from "../../prisma/contract";

export type CampusSize = "SMALL" | "MEDIUM" | "LARGE";

// dateOfBirth is a branded TimestampString on the model row rather than a bare
// string, so a validated date has to be re-tagged before it can be written.
type DateOfBirth = FieldOutputTypes["public"]["StudentProfile"]["dateOfBirth"];

export type StudentProfileFields = Partial<{
    firstName: string;
    lastName: string;
    dateOfBirth: DateOfBirth;
    country: string;
    phone: string;
    gpa: number;
    satScore: number;
    actScore: number;
    highSchool: string;
    graduationYear: string;
    classRank: string;
    major: string;
    preferredMajors: string[];
    preferredLocations: string[];
    preferredRegion: string;
    size: CampusSize;
    budgetRange: number[];
    campusVibes: string[];
    extracurriculars: string[];
    careerGoals: string;
    priority: string;
}>;

// StudentProfile.firstName, lastName, and dateOfBirth are NOT NULL with no
// default, so the row cannot be created until step 0 has been filled in.
export const REQUIRED_PROFILE_FIELDS = ["firstName", "lastName", "dateOfBirth"] as const;

type Payload = Record<string, unknown>;

const text = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
};

// Number inputs post their value as a string, so "1450" has to parse as 1450
// while "" and null stay undefined (i.e. "leave this column alone").
const float = (value: unknown): number | undefined => {
    if (value === null || value === undefined || value === "") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};

const int = (value: unknown): number | undefined => {
    const parsed = float(value);
    return parsed === undefined ? undefined : Math.round(parsed);
};

const textList = (value: unknown): string[] | undefined =>
    Array.isArray(value)
        ? value.filter((item): item is string => typeof item === "string")
        : undefined;

// A partially-parsed budget range would silently shift a bound, so the whole
// list is rejected unless every entry parses.
const intList = (value: unknown): number[] | undefined => {
    if (!Array.isArray(value)) return undefined;
    const parsed = value.map(int);
    return parsed.every((item): item is number => item !== undefined) ? parsed : undefined;
};

// graduationYear is text in the table but a number in the form.
const yearText = (value: unknown): string | undefined => {
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : undefined;
    return text(value);
};

// <input type="date"> posts YYYY-MM-DD, which Postgres reads as a timestamp.
// An unparseable date is treated as absent rather than forwarded, so a typo
// can't turn into a 500 from the driver.
const timestamp = (value: unknown): DateOfBirth | undefined => {
    const raw = text(value);
    if (raw === undefined || Number.isNaN(Date.parse(raw))) return undefined;
    return raw as DateOfBirth;
};

const campusSize = (value: unknown): CampusSize | undefined => {
    const label = text(value)?.toUpperCase();
    return label === "SMALL" || label === "MEDIUM" || label === "LARGE" ? label : undefined;
};

const withoutUndefined = (fields: StudentProfileFields): StudentProfileFields =>
    Object.fromEntries(
        Object.entries(fields).filter(([, value]) => value !== undefined),
    ) as StudentProfileFields;

export const mapStudentProfile = (studentData: unknown): StudentProfileFields => {
    const data = (studentData ?? {}) as Payload;

    return withoutUndefined({
        firstName: text(data.firstName),
        lastName: text(data.lastName),
        dateOfBirth: timestamp(data.dateOfBirth),
        country: text(data.country),
        phone: text(data.phone),
        gpa: float(data.gpa),
        satScore: float(data.satScore),
        actScore: float(data.act ?? data.actScore),
        highSchool: text(data.highSchool),
        graduationYear: yearText(data.graduationYear),
        classRank: text(data.classRank),
        major: text(data.major),
        preferredMajors: textList(data.preferredMajors),
        preferredLocations: textList(data.preferredLocations),
        preferredRegion: text(data.preferredRegion),
        size: campusSize(data.size),
        budgetRange: intList(data.budgetRange),
        campusVibes: textList(data.campusVibes),
        extracurriculars: textList(data.extracurriculars),
        careerGoals: text(data.careerGoal ?? data.careerGoals),
        priority: text(data.priority),
    });
};

// Onboarding may only advance the user's step. Role, email, and password stay
// server-owned: spreading the client's userData into the User update would let
// a caller PATCH themselves to ADMIN or overwrite their credentials.
export const mapUserFields = (userData: unknown): { onboardingStep?: number } => {
    const step = int((userData as Payload | undefined)?.onboardingStep);
    return step === undefined ? {} : { onboardingStep: Math.max(0, step) };
};

export const missingRequiredFields = (fields: StudentProfileFields): string[] =>
    REQUIRED_PROFILE_FIELDS.filter((field) => fields[field] === undefined);
