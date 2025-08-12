import z from 'zod';

export const createAlbumSchema = z.object({
  name: z.string().nonempty(),
  genre: z.string().nonempty().optional(),
  release_year: z.number().gt(0).optional(),
  artistIds: z.array(z.number())
});

export const searchAlbumSchema = z.object({
  name: z.string()
});
