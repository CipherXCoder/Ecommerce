import { z } from 'zod';

export const cartSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});

export const changeQuantitySchema = z.object({
  quantity: z.number().min(1),
});