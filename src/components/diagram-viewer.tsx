"use client";

import { useEffect, useRef, useState } from "react";
import type { MermaidConfig } from "mermaid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme as useNextTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Dynamically import mermaid to avoid SSR issues
const mermaidPromise = import("mermaid").then((m) => m.default);

interface DiagramViewerProps {
  code: string;
  theme: string;
  setTheme: (theme: string) => void;
}

const darkThemeVariables = {
    background: '#333',
    primaryColor: '#333',
    primaryTextColor: '#fff',
    lineColor: '#888888',
    textColor: '#f0f0f0',
    nodeBorder: '#888888',
    mainBkg: '#333333',
    nodeTextColor: '#fff',
};

export default function DiagramViewer({ code, theme: selectedTheme, setTheme }: DiagramViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { resolvedTheme } = useNextTheme();

  const isDark = selectedTheme === 'dark';

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const mermaid = await mermaidPromise;
        
        const config: MermaidConfig = {
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'Inter, sans-serif',
        };

        if (isDark) {
            config.themeVariables = darkThemeVariables;
        }

        mermaid.initialize(config);

        if (viewerRef.current && code) {
          try {
            // The model sometimes adds classDef, which can interfere with themes.
            // We will strip it before parsing to be safe.
            const cleanCode = code.replace(/^\s*classDef\s.*$/gm, '');
            await mermaid.parse(cleanCode); // validation
            
            const { svg } = await mermaid.render(
              "mermaid-svg-" + Date.now(),
              cleanCode // Use cleaned code
            );
            
            if (viewerRef.current) {
              viewerRef.current.innerHTML = svg;
            }
            setError(null);
          } catch(e: any) {
            console.error("Mermaid rendering error:", e);
            setError(e.message || e.str || "Invalid Mermaid syntax. Please check your code.");
            if (viewerRef.current) {
              viewerRef.current.innerHTML = '';
            }
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
  }, [code, selectedTheme, isDark]);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: 'Copied to clipboard!', description: 'Mermaid code has been copied.' });
    } catch (err) {
      // Fallback for when navigator.clipboard is not available
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";  // Avoid scrolling to bottom
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast({ title: 'Copied to clipboard!', description: 'Mermaid code has been copied.' });
      } catch (copyErr) {
        console.error('Fallback copy failed', copyErr);
        toast({ title: 'Copy failed', description: 'Could not copy code to clipboard.', variant: 'destructive' });
      }
      document.body.removeChild(textArea);
    }
  }

  const handleDownload = async () => {
    if (!viewerRef.current?.firstElementChild || error) {
      toast({ title: 'Download failed', description: error ? 'Cannot download a diagram with errors.' : 'There is no diagram to download.', variant: 'destructive'});
      return;
    }

    try {
        const mermaid = await mermaidPromise;
        const config: MermaidConfig = {
            startOnLoad: false,
            theme: isDark ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'Inter, sans-serif',
        };
        if (isDark) {
            config.themeVariables = darkThemeVariables;
        }
        mermaid.initialize(config);

        const cleanCode = code.replace(/^\s*classDef\s.*$/gm, '');

        let { svg } = await mermaid.render("mermaid-download-svg-" + Date.now(), cleanCode);
        
        // Sanitize <br> tags to be XML-compliant
        let svgContent = svg.replace(/<br>/g, '<br/>');

        if (isDark) {
          // Inject a dark background rectangle into the SVG
          const darkBgRect = `<rect x="0" y="0" width="100%" height="100%" fill="#1a1a1a"></rect>`;
          const svgTagEnd = svgContent.indexOf('>') + 1;
          svgContent = svgContent.slice(0, svgTagEnd) + darkBgRect + svgContent.slice(svgTagEnd);
        }

        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'diagram.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
        toast({ title: 'Downloading diagram.svg' });

    } catch (e) {
        console.error("Failed to render diagram for download", e);
        toast({ title: 'Download failed', description: 'Could not render diagram for download.', variant: 'destructive'});
    }
  }

  return (
    <Card className="flex-1 flex flex-col h-full shadow-lg">
      <CardHeader className="flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-lg font-headline">Visualization</CardTitle>
        <div className="flex items-center gap-2">
            <Label htmlFor="theme-select" className="text-sm font-normal sr-only sm:not-sr-only">Theme</Label>
            <Select value={selectedTheme} onValueChange={setTheme}>
                <SelectTrigger id="theme-select" className="w-[120px]">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
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
      <CardContent className={cn("flex-1 p-4 overflow-auto relative flex items-center justify-center transition-colors", isDark ? 'bg-[#1a1a1a]' : 'bg-muted/30')}>
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
