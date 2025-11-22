'use server';
/**
 * @fileOverview A flow that enhances a Mermaid diagram based on LLM suggestions.
 *
 * - enhanceDiagramWithLLM - A function that enhances a Mermaid diagram.
 * - EnhanceDiagramWithLLMInput - The input type for the enhanceDiagramWithLLM function.
 * - EnhanceDiagramWithLLMOutput - The return type for the enhanceDiagramWithLLM function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceDiagramWithLLMInputSchema = z.object({
  diagramCode: z.string().describe('The Mermaid diagram code to enhance.'),
  enhancementPrompt: z.string().describe('A prompt describing the desired enhancements to the diagram.'),
});
export type EnhanceDiagramWithLLMInput = z.infer<typeof EnhanceDiagramWithLLMInputSchema>;

const EnhanceDiagramWithLLMOutputSchema = z.object({
  enhancedDiagramCode: z.string().describe('The enhanced Mermaid diagram code.'),
});
export type EnhanceDiagramWithLLMOutput = z.infer<typeof EnhanceDiagramWithLLMOutputSchema>;

export async function enhanceDiagramWithLLM(input: EnhanceDiagramWithLLMInput): Promise<EnhanceDiagramWithLLMOutput> {
  return enhanceDiagramWithLLMFlow(input);
}

const enhanceDiagramWithLLMPrompt = ai.definePrompt({
  name: 'enhanceDiagramWithLLMPrompt',
  input: {schema: EnhanceDiagramWithLLMInputSchema},
  output: {schema: EnhanceDiagramWithLLMOutputSchema},
  model: 'googleai/gemini-2.5-flash-lite',
  prompt: `You are an expert in Mermaid diagrams.

  The user will provide you with a Mermaid diagram code and a prompt describing desired enhancements.
  Your task is to enhance the diagram code based on the prompt.
  
  IMPORTANT: Do not add any 'classDef', 'linkStyle', or other styling commands. The styling is handled by a theme selector.

  Original Diagram Code:
  '''mermaid
  {{{diagramCode}}}
  '''

  Please provide the full, enhanced Mermaid diagram code below.
  `,
});

const enhanceDiagramWithLLMFlow = ai.defineFlow(
  {
    name: 'enhanceDiagramWithLLMFlow',
    inputSchema: EnhanceDiagramWithLLMInputSchema,
    outputSchema: EnhanceDiagramWithLLMOutputSchema,
  },
  async input => {
    const {output} = await enhanceDiagramWithLLMPrompt(input);
    
    let enhancedCode = output!.enhancedDiagramCode;
    // The model sometimes wraps the code in ```mermaid ... ```, so we should strip that.
    const codeBlockRegex = /'''(?:mermaid)?\s*([\s\S]*?)\s*'''/;
    const match = codeBlockRegex.exec(enhancedCode);
    if (match) {
      enhancedCode = match[1].trim();
    }

    return {
      enhancedDiagramCode: enhancedCode,
    };
  }
);
