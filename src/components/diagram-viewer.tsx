"use client";

import { useEffect, useRef, useState } from "react";
import type { MermaidConfig } from "mermaid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dynamically import mermaid to avoid SSR issues
const mermaidPromise = import("mermaid").then((m) => m.default);

interface DiagramViewerProps {
  code: string;
  theme: string;
  setTheme: (theme: string) => void;
}

export default function DiagramViewer({ code, theme, setTheme }: DiagramViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const mermaid = await mermaidPromise;
        mermaid.initialize({
          startOnLoad: false,
          theme: theme,
          securityLevel: 'loose',
          fontFamily: 'Inter, sans-serif'
        } as MermaidConfig);

        if (viewerRef.current && code) {
          // Check syntax before rendering
          try {
            await mermaid.parse(code);
            setError(null);
          } catch(e: any) {
            setError(e.str || "Invalid Mermaid syntax. Please check your code.");
            if (viewerRef.current) viewerRef.current.innerHTML = '';
            return;
          }

          const { svg } = await mermaid.render(
            "mermaid-svg-" + Date.now(),
            code
          );

          if (viewerRef.current) {
            viewerRef.current.innerHTML = svg;
          }
        } else if (viewerRef.current) {
          viewerRef.current.innerHTML = '';
          setError(null);
        }
      } catch (e) {
        console.error(e);
        setError("An unexpected error occurred while rendering the diagram.");
        if (viewerRef.current) {
            viewerRef.current.innerHTML = '';
        }
      }
    };

    renderDiagram();
  }, [code, theme]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied to clipboard!', description: 'Mermaid code has been copied.' });
  }

  const handleDownload = () => {
    if (viewerRef.current?.firstElementChild) {
        const svgBlob = new Blob([viewerRef.current.innerHTML], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'diagram.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
        toast({ title: 'Downloading diagram.svg' });
    } else if (error) {
        toast({ title: 'Download failed', description: 'Cannot download a diagram with errors.', variant: 'destructive'});
    } else {
        toast({ title: 'Download failed', description: 'There is no diagram to download.', variant: 'destructive'});
    }
  }

  return (
    <Card className="flex-1 flex flex-col h-full shadow-lg">
      <CardHeader className="flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-lg font-headline">Visualization</CardTitle>
        <div className="flex items-center gap-2">
            <Label htmlFor="theme-select" className="text-sm font-normal sr-only sm:not-sr-only">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme-select" className="w-[120px]">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy Mermaid Code">
                <Share2 className="h-4 w-4"/>
                <span className="sr-only">Copy Code</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload} aria-label="Download Diagram as SVG">
                <Download className="h-4 w-4"/>
                <span className="sr-only">Download SVG</span>
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-auto relative flex items-center justify-center bg-muted/30">
        <div ref={viewerRef} className="w-full h-full [&>svg]:max-w-full [&>svg]:h-auto" />
        {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 p-4 text-center">
                <p className="font-bold text-destructive">Diagram Error</p>
                <pre className="mt-2 text-xs text-destructive bg-destructive/20 p-2 rounded-md whitespace-pre-wrap w-full max-w-md">{error}</pre>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
