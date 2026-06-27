import { UserRole } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            // Add your custom user object structure here
            user?: {
                id: string;
                email: string;
                role: UserRole;
            };
        }
    }
}