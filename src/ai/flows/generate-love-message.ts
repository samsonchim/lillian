
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
      'The mood selected by Lillian for the love message. E.g., Happy, Sad, Reflective, Excited, Joyful, Content, Grateful, Hopeful, Peaceful, Playful, Proud, Confident, Curious, Inspired, Optimistic, Amused, Loving, Energetic, Angry, Anxious, Frustrated, Lonely, Depressed, Jealous, Embarrassed, Guilty, Irritated, Overwhelmed, Annoyed, Bitter, Fearful, Regretful, Thoughtful, Pensive, Conflicted, Indifferent, Numb, Apathetic, Skeptical, Uncertain, Surprised, Furious, Euphoric, Desperate, Ecstatic, Devastated, Shocked, Enraged, Terrified, Obsessive, Hysterical'
    ),
});
export type GenerateLoveMessageInput = z.infer<typeof GenerateLoveMessageInputSchema>;

const GenerateLoveMessageOutputSchema = z.object({
  message: z.string().describe('The generated love message from Samson Chi to Lillian.'),
});
export type GenerateLoveMessageOutput = z.infer<typeof GenerateLoveMessageOutputSchema>;

export async function generateLoveMessage(input: GenerateLoveMessageInput): Promise<GenerateLoveMessageOutput> {
  return generateLoveMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLoveMessagePrompt',
  input: {schema: GenerateLoveMessageInputSchema},
  output: {schema: GenerateLoveMessageOutputSchema},
  prompt: `You are an AI assistant that specializes in writing heartfelt love messages.
Your persona is Samson Chi, writing to his beloved girlfriend, Lillian.
Lillian will select a mood, and you will craft a message from Samson Chi to her, reflecting that mood and his deep love.

Selected Mood by Lillian: {{{mood}}}

Instructions:
- Write the love message from the perspective of Samson Chi.
- Address the message to Lillian.
- Express Samson Chi's feelings for Lillian, inspired by the mood she selected.
- Ensure the tone is loving, personal, and appropriate for a message from a boyfriend to his girlfriend.
- Convey deep affection and make Lillian feel cherished by Samson Chi.`,
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
