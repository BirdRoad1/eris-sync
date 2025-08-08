import z from 'zod';

export const createClientSchema = z.object({
  name: z.string().nonempty()
});

export const clientQuerySchema = z.object({
  id: z.preprocess(str => {
    if (typeof str !== 'string' || !/^\d+$/.test(str)) {
      return NaN;
    }

    return Number(str);
  }, z.number().int())
});
