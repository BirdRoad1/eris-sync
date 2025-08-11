import z from 'zod';

export const createArtistSchema = z.object({
  name: z.string().nonempty()
});

export const searchArtistSchema = z.object({
  name: z.string()
});
