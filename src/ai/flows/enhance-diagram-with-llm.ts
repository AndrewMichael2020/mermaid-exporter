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
  prompt: `You are an expert in Mermaid diagrams.

  The user will provide you with a Mermaid diagram code and a prompt describing desired enhancements.
  Your task is to enhance the diagram code based on the prompt.

  Original Diagram Code:
  ```mermaid
  {{{diagramCode}}}
  ```

  Enhancement Prompt: {{{enhancementPrompt}}}

  Enhanced Diagram Code:
  ```mermaid
  `, // Note the prompt will continue from here in the flow
});

const enhanceDiagramWithLLMFlow = ai.defineFlow(
  {
    name: 'enhanceDiagramWithLLMFlow',
    inputSchema: EnhanceDiagramWithLLMInputSchema,
    outputSchema: EnhanceDiagramWithLLMOutputSchema,
  },
  async input => {
    const {output} = await enhanceDiagramWithLLMPrompt(input);
    return {
      enhancedDiagramCode: output!.enhancedDiagramCode, // The prompt ends with the ``` so it looks like code.
    };
  }
);
