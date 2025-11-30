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
  1. If a node label contains special characters (like parentheses, brackets, or quotes), you MUST wrap the label in double quotes.
     Example: A["Node with (parentheses)"] --> B["Another Node"]
  2. Ensure all brackets are properly closed.
  3. THEMING AND COLORS: For all diagram types EXCEPT erDiagram (ER diagrams), include a theme initialization block at the very beginning of the code with colorful styling. Use the following format:
     
     %%{init: {
       "theme": "base",
       "themeVariables": {
         "primaryColor": "#E6F7FF",
         "primaryBorderColor": "#0A84C1",
         "primaryTextColor": "#003A57",
         "secondaryColor": "#EAF7EA",
         "secondaryBorderColor": "#4CAF50",
         "secondaryTextColor": "#1B5E20",
         "tertiaryColor": "#FFF8D6",
         "tertiaryBorderColor": "#D69E00",
         "tertiaryTextColor": "#705400",
         "lineColor": "#0A84C1",
         "fontFamily": "Inter, sans-serif"
       }
     }}%%
     
     Use appropriate themeVariables based on the diagram type:
     - For flowchart/graph: use primaryColor, secondaryColor, tertiaryColor for nodes
     - For sequenceDiagram: use actorBkg, actorBorder, actorTextColor, signalColor, signalTextColor
     - For stateDiagram: use primaryColor, primaryBorderColor, primaryTextColor
     - For classDiagram: use primaryColor, primaryBorderColor, primaryTextColor
     - For other diagram types (timeline, gantt, gitGraph, journey, mindmap, pie): include relevant themeVariables that enhance visual appearance
     
  4. For erDiagram (ER diagrams), do NOT include any theme initialization block. Keep the code clean without styling.

  Description: {{{description}}}`,
});

const generateDiagramFlow = ai.defineFlow(
  {
    name: 'generateDiagramFlow',
    inputSchema: GenerateDiagramInputSchema,
    outputSchema: GenerateDiagramOutputSchema,
  },
  async input => {
    let output;
    try {
      const result = await prompt(input);
      output = result.output;
    } catch (err) {
      // Log full error server-side for diagnosis and return a safe message to callers
      // so production builds don't leak sensitive details in the client error.
      // The original stack and message will appear in Cloud Run logs.
      console.error('LLM request failed in generateDiagramFlow:', err);
      throw new Error('Diagram generation failed: upstream language model error.');
    }

    // Clean up markdown code fences if present, but preserve theme/styling blocks
    if (output && output.mermaidCode) {
      output.mermaidCode = output.mermaidCode
        .replace(/```mermaid/g, '')
        .replace(/```/g, '')
        .trim();
    }

    return output!;
  }
);
