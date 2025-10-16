import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(6)
});

export const addressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().optional(),
  city: z.string(),
  country: z.string(),
  pincode: z.string().length(5),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippingAddress: z.number().optional(),
  defaultBillingAddress: z.number().optional()
});

export const changeUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "USER"])
});