'use server';
/**
 * @fileOverview Generates Mermaid diagram code from a natural language description.
 *
 * - generateDiagram - A function that takes a natural language description and returns Mermaid diagram code.
 * - GenerateDiagramInput - The input type for the generateDiagram function.
 * - GenerateDiagramOutput - The return type for the generateDiagram function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDiagramInputSchema = z.object({
  description: z.string().describe('A natural language description of the diagram.'),
});
export type GenerateDiagramInput = z.infer<typeof GenerateDiagramInputSchema>;

const GenerateDiagramOutputSchema = z.object({
  mermaidCode: z.string().describe('The Mermaid code for the diagram.'),
});
export type GenerateDiagramOutput = z.infer<typeof GenerateDiagramOutputSchema>;

export async function generateDiagram(input: GenerateDiagramInput): Promise<GenerateDiagramOutput> {
  return generateDiagramFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDiagramPrompt',
  input: {schema: GenerateDiagramInputSchema},
  output: {schema: GenerateDiagramOutputSchema},
  model: 'googleai/gemini-2.5-flash-lite',
  prompt: `You are an expert in Mermaid syntax.

  You will generate Mermaid code based on the user's description. Ensure the generated code is valid Mermaid code.
  
  IMPORTANT GUIDELINES:
  1. Do not add any 'classDef', 'linkStyle', or other styling commands. The styling is handled by a theme selector.
  2. If a node label contains special characters (like parentheses, brackets, or quotes), you MUST wrap the label in double quotes.
     Example: A["Node with (parentheses)"] --> B["Another Node"]
  3. Ensure all brackets are properly closed.

  Description: {{{description}}}`,
});

const generateDiagramFlow = ai.defineFlow(
  {
    name: 'generateDiagramFlow',
    inputSchema: GenerateDiagramInputSchema,
    outputSchema: GenerateDiagramOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    // Sanitize the output to remove unwanted styling commands
    if (output && output.mermaidCode) {
      output.mermaidCode = output.mermaidCode
        .replace(/^\s*classDef\s.*$/gm, '')
        .replace(/^\s*linkStyle\s.*$/gm, '')
        .replace(/```mermaid/g, '')
        .replace(/```/g, '')
        .trim();
    }
    
    return output!;
  }
);
