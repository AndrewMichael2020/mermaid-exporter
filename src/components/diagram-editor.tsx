/**
 * v0 by Vercel.
 * @see https://v0.dev/t/fYj8iQ0p6aN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Code, BrainCircuit, Wand2, RotateCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  generateDiagram,
  enhanceDiagramWithLLM,
} from "@/ai/flows";

interface DiagramEditorProps {
  code: string;
  onCodeChange: (newCode: string) => void;
}

export default function DiagramEditor({ code, onCodeChange }: DiagramEditorProps) {
  const [activeTab, setActiveTab] = useState("code");
  const [generateDescription, setGenerateDescription] = useState("");
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateDiagram({ description: generateDescription });
      if (result && result.mermaidCode) {
        onCodeChange(result.mermaidCode);
        setActiveTab("code");
        toast({
          title: "Diagram Generated",
          description: "The diagram has been successfully generated.",
        });
      }
    } catch (error) {
      toast({
        title: "Error Generating Diagram",
        description:
          "An error occurred while generating the diagram. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating diagram:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      const result = await enhanceDiagramWithLLM({ diagramCode: code, enhancementPrompt: enhancePrompt });
      if (result && result.enhancedDiagramCode) {
        onCodeChange(result.enhancedDiagramCode);
        setActiveTab("code");
        toast({
          title: "Diagram Enhanced",
          description: "The diagram has been successfully enhanced.",
        });
      }
    } catch (error) {
      toast({
        title: "Error Enhancing Diagram",
        description:
          "An error occurred while enhancing the diagram. Please try again.",
        variant: "destructive",
      });
      console.error("Error enhancing diagram:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Card className="flex flex-col h-full shadow-lg">
      <CardContent className="p-0 flex flex-col flex-1">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <div className="p-4 border-b">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="code">
                <Code className="mr-1 sm:mr-2 h-4 w-4" /> Code
              </TabsTrigger>
              <TabsTrigger value="generate">
                <BrainCircuit className="mr-1 sm:mr-2 h-4 w-4" /> Generate
              </TabsTrigger>
              <TabsTrigger value="enhance">
                <Wand2 className="mr-1 sm:mr-2 h-4 w-4" /> Enhance
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="code" className="flex-1 flex flex-col p-4">
            <Textarea
              placeholder="Paste your Mermaid code here..."
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              className="w-full font-mono text-sm resize-y flex-1"
              aria-label="Mermaid code editor"
            />
          </TabsContent>
          <TabsContent value="generate" className="p-4 flex flex-col gap-4">
            <Textarea
              placeholder="Describe the diagram you want to create... e.g., 'a flowchart with a start node, a decision node, and two end nodes'"
              value={generateDescription}
              onChange={(e) => setGenerateDescription(e.target.value)}
              className="w-full resize-y"
              aria-label="Diagram generation description"
              rows={5}
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
              )}
              {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>
          </TabsContent>
          <TabsContent value="enhance" className="p-4 flex flex-col gap-4">
            <Textarea
              placeholder="Describe how you want to enhance the current diagram... e.g., 'add a new step after the decision node' or 'change the color of the start node to red'"
              value={enhancePrompt}
              onChange={(e) => setEnhancePrompt(e.target.value)}
              className="w-full resize-y"
              aria-label="Diagram enhancement prompt"
              rows={5}
            />
            <Button
              onClick={handleEnhance}
              disabled={isEnhancing}
              className="w-full"
            >
              {isEnhancing ? (
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {isEnhancing ? "Enhancing..." : "Enhance with AI"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
