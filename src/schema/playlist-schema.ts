import z from 'zod';

export const createPlaylistSchema = z.object({
  name: z.string().nonempty()
});

export const addSongToPlaylistSchema = z.object({
  id: z.number()
});
