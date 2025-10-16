import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.preprocess((val) => {
    // accept numeric string or number -> return number
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed === '') return NaN;
      const n = Number(trimmed);
      return Number.isFinite(n) ? n : val;
    }
    return val;
  }, z.number().nonnegative()),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).min(0).optional().default([]),
});