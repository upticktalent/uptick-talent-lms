import { z } from 'zod';
export declare const userSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
