import z from 'zod';

export const CreateSongSchema = z.object({
  title: z.string()
});
