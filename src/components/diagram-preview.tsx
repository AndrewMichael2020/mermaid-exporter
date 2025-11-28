"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { cn } from "@/lib/utils";

interface DiagramPreviewProps {
  code: string;
  className?: string;
}

export default function DiagramPreview({ code, className }: DiagramPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const render = async () => {
      if (!code) return;
      
      // Reset state
      setError(false);
      
      try {
        // Use a separate ID for each preview to avoid conflicts
        const id = `preview-${Math.random().toString(36).substr(2, 9)}`;
        
        // Initialize with a safe config for previews
        // Use a relaxed type for the mermaid config because some runtime options
        // (like suppressErrorRendering) may not be present in the TS definitions
        const previewConfig = {
          startOnLoad: false,
          theme: 'base', // Neutral theme for gallery
          securityLevel: 'loose',
          fontFamily: 'Inter, sans-serif',
          // Suppress Mermaid's default error rendering and let our UI handle errors
          suppressErrors: true,
        } as unknown as import('mermaid').MermaidConfig;

        mermaid.initialize(previewConfig);
        // Prevent Mermaid from injecting its own error UI
        if (typeof mermaid.setParseErrorHandler === 'function') {
          mermaid.setParseErrorHandler(() => {
            // no-op: we prefer to show our own error message
          });
        }

        // Validate first and avoid render if invalid
        const cleanCode = code.replace(/^\s*classDef\s.*$/gm, '');
        try {
          await mermaid.parse(cleanCode, { suppressErrors: true });
        } catch (_) {
          setError(true);
          return;
        }
        const { svg } = await mermaid.render(id, cleanCode);
        setSvg(svg);
      } catch (e) {
        console.error("Preview render failed", e);
        setError(true);
      }
    };

    render();
  }, [code]);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "w-full h-[200px] flex items-center justify-center overflow-hidden bg-muted/10 rounded-md border border-border/50 p-2", 
        className
      )}
    >
      {error ? (
        <div className="text-xs text-muted-foreground text-center p-4">
          Preview unavailable for this diagram type.
        </div>
      ) : svg ? (
        <div 
          dangerouslySetInnerHTML={{ __html: svg }} 
          className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
        />
      ) : (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      )}
    </div>
  );
}
