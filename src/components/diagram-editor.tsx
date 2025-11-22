/**
 * v0 by Vercel.
 * @see https://v0.dev/t/fYj8iQ0p6aN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, BrainCircuit, Wand2, RotateCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { logUserActivity } from "@/lib/logging";
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
  const { user } = useAuth();

  const checkAuth = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to use AI features.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!checkAuth()) return;

    setIsGenerating(true);
    try {
      logUserActivity(user?.uid, 'start_generate_diagram');
      const result = await generateDiagram({ description: generateDescription });
      if (result && result.mermaidCode) {
        onCodeChange(result.mermaidCode);
        setActiveTab("code");
        logUserActivity(user?.uid, 'success_generate_diagram');
        toast({
          title: "Diagram Generated",
          description: "The diagram has been successfully generated.",
        });
      }
    } catch (error) {
      logUserActivity(user?.uid, 'error_generate_diagram', { error: String(error) });
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
    if (!checkAuth()) return;

    setIsEnhancing(true);
    try {
      logUserActivity(user?.uid, 'start_enhance_diagram');
      const result = await enhanceDiagramWithLLM({ diagramCode: code, enhancementPrompt: enhancePrompt });
      if (result && result.enhancedDiagramCode) {
        onCodeChange(result.enhancedDiagramCode);
        setActiveTab("code");
        logUserActivity(user?.uid, 'success_enhance_diagram');
        toast({
          title: "Diagram Enhanced",
          description: "The diagram has been successfully enhanced.",
        });
      }
    } catch (error) {
      logUserActivity(user?.uid, 'error_enhance_diagram', { error: String(error) });
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
    <div className="flex flex-col h-full rounded-lg border bg-card text-card-foreground shadow-lg overflow-hidden">
      {/* Header Section: Tabs Control Only */}
      <div className="p-4 border-b bg-muted/20 flex-none">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
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
        </Tabs>
      </div>

      {/* Content Section: Manual rendering to ensure strict layout control */}
      <div className="flex-1 flex flex-col min-h-0 bg-card">
        
        {/* Code Tab Content */}
        {activeTab === "code" && (
          <div className="flex flex-col flex-1 p-4 h-full">
            <Textarea
              placeholder="Paste your Mermaid code here..."
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              className="w-full min-h-full resize-y font-mono text-sm"
              aria-label="Mermaid code editor"
            />
          </div>
        )}

        {/* Generate Tab Content */}
        {activeTab === "generate" && (
          <div className="flex flex-col p-4 gap-4 justify-start">
            <Textarea
              placeholder="Describe the diagram you want to create... e.g., 'a flowchart with a start node, a decision node, and two end nodes'"
              value={generateDescription}
              onChange={(e) => setGenerateDescription(e.target.value)}
              className="w-full min-h-[300px] resize-y"
              aria-label="Diagram generation description"
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
          </div>
        )}

        {/* Enhance Tab Content */}
        {activeTab === "enhance" && (
          <div className="flex flex-col p-4 gap-4 justify-start">
            <Textarea
              placeholder="Describe how you want to enhance the current diagram... e.g., 'add a new step after the decision node' or 'change the color of the start node to red'"
              value={enhancePrompt}
              onChange={(e) => setEnhancePrompt(e.target.value)}
              className="w-full min-h-[300px] resize-y"
              aria-label="Diagram enhancement prompt"
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
          </div>
        )}
      </div>
    </div>
  );
}
