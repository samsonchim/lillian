'use server';

/**
 * @fileOverview Generates a personalized love message tailored to a selected mood.
 *
 * - generateLoveMessage - A function that generates the love message.
 * - GenerateLoveMessageInput - The input type for the generateLoveMessage function.
 * - GenerateLoveMessageOutput - The return type for the generateLoveMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLoveMessageInputSchema = z.object({
  mood: z
    .string()
    .describe(
      'The mood for the love message. E.g., Happy, Sad, Reflective, Excited, Joyful, Content, Grateful, Hopeful, Peaceful, Playful, Proud, Confident, Curious, Inspired, Optimistic, Amused, Loving, Energetic, Angry, Anxious, Frustrated, Lonely, Depressed, Jealous, Embarrassed, Guilty, Irritated, Overwhelmed, Annoyed, Bitter, Fearful, Regretful, Thoughtful, Pensive, Conflicted, Indifferent, Numb, Apathetic, Skeptical, Uncertain, Surprised, Furious, Euphoric, Desperate, Ecstatic, Devastated, Shocked, Enraged, Terrified, Obsessive, Hysterical'
    ),
});
export type GenerateLoveMessageInput = z.infer<typeof GenerateLoveMessageInputSchema>;

const GenerateLoveMessageOutputSchema = z.object({
  message: z.string().describe('The generated love message.'),
});
export type GenerateLoveMessageOutput = z.infer<typeof GenerateLoveMessageOutputSchema>;

export async function generateLoveMessage(input: GenerateLoveMessageInput): Promise<GenerateLoveMessageOutput> {
  return generateLoveMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLoveMessagePrompt',
  input: {schema: GenerateLoveMessageInputSchema},
  output: {schema: GenerateLoveMessageOutputSchema},
  prompt: `You are an AI assistant that specializes in writing heartfelt love messages.  The messages should be personalized and tailored to the mood specified by the user.

  Mood: {{{mood}}}

  Write a love message for Samson, expressing Lillian's feelings in the specified mood.  Include a reference that Samson Chi loves you.`,
});

const generateLoveMessageFlow = ai.defineFlow(
  {
    name: 'generateLoveMessageFlow',
    inputSchema: GenerateLoveMessageInputSchema,
    outputSchema: GenerateLoveMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
