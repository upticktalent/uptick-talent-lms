import {z} from 'zod'

export const userSchema = z.object({
  firstName: z.string().min(3).trim(),
  lastName: z.string().min(3).trim(),
  email: z.string().email(),
  password: z.string().min(6),
});