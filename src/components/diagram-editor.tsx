"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2, BrainCircuit, Code, RotateCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { generateDiagram } from "@/ai/flows/generate-diagram-from-description";
import { enhanceDiagramWithLLM } from "@/ai/flows/enhance-diagram-with-llm";

interface DiagramEditorProps {
  code: string;
  setCode: (code: string) => void;
  toast: (options: { title: string; description?: string; variant?: "default" | "destructive" }) => void;
}

export default function DiagramEditor({ code, setCode, toast }: DiagramEditorProps) {
  const [activeTab, setActiveTab] = useState("code");
  const [generateDescription, setGenerateDescription] = useState("");
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleGenerate = async () => {
    if (!generateDescription.trim()) {
      toast({ title: "Error", description: "Please enter a description for the diagram.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateDiagram({ description: generateDescription });
      setCode(result.mermaidCode);
      setActiveTab("code");
      toast({ title: "Success", description: "Diagram generated successfully!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to generate diagram. Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhance = async () => {
    if (!enhancePrompt.trim()) {
      toast({ title: "Error", description: "Please enter an enhancement prompt.", variant: "destructive" });
      return;
    }
    setIsEnhancing(true);
    try {
      const result = await enhanceDiagramWithLLM({ diagramCode: code, enhancementPrompt: enhancePrompt });
      setCode(result.enhancedDiagramCode);
      setActiveTab("code");
      toast({ title: "Success", description: "Diagram enhanced successfully!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to enhance diagram. Please try again.", variant: "destructive" });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Card className="flex flex-col h-full shadow-lg">
      <CardContent className="p-0 flex flex-col flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="p-4 border-b">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="code"><Code className="mr-1 sm:mr-2 h-4 w-4" /> Code</TabsTrigger>
              <TabsTrigger value="generate"><BrainCircuit className="mr-1 sm:mr-2 h-4 w-4" /> Generate</TabsTrigger>
              <TabsTrigger value="enhance"><Wand2 className="mr-1 sm:mr-2 h-4 w-4" /> Enhance</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="code" className="flex-1 flex flex-col m-0 p-4">
            <Textarea
              placeholder="Paste your Mermaid code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 h-full font-mono text-sm resize-y"
              aria-label="Mermaid code editor"
            />
          </TabsContent>
          <TabsContent value="generate" className="flex-1 flex flex-col m-0 p-4 space-y-4">
            <Textarea
              placeholder="Describe the diagram you want to create... e.g., 'a flowchart with a start node, a decision node, and two end nodes'"
              value={generateDescription}
              onChange={(e) => setGenerateDescription(e.target.value)}
              className="flex-1 h-full resize-y"
              aria-label="Diagram generation description"
            />
            <Button onClick={handleGenerate} disabled={isGenerating} className="shrink-0">
              {isGenerating ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
              {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>
          </TabsContent>
          <TabsContent value="enhance" className="flex-1 flex flex-col m-0 p-4 space-y-4">
            <Textarea
              placeholder="Describe how you want to enhance the current diagram... e.g., 'add a new step after the decision node' or 'change the color of the start node to red'"
              value={enhancePrompt}
              onChange={(e) => setEnhancePrompt(e.target.value)}
              className="flex-1 h-full resize-y"
              aria-label="Diagram enhancement prompt"
            />
            <Button onClick={handleEnhance} disabled={isEnhancing} className="shrink-0">
              {isEnhancing ? <RotateCw className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {isEnhancing ? "Enhancing..." : "Enhance with AI"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
