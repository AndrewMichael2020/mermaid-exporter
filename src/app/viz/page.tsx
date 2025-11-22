'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/header';
import DiagramEditor from '@/components/diagram-editor';
import DiagramViewer from '@/components/diagram-viewer';
import { logUserActivity } from '@/lib/logging';

const defaultDiagram = `graph TD
    A[Start] --> B{Is it?};
    B -- Yes --> C[OK];
    C --> D[End];
    B -- No --> E[Find out];
    E --> B;`;

export default function VizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [diagramCode, setDiagramCode] = useState(defaultDiagram);
  const [theme, setTheme] = useState('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Log visit
    logUserActivity(user?.uid, 'visit_viz_page');
  }, [user]);

  // Auth check removed to allow public access
  /*
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  */

  if (loading) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header 
        onGeneratedCode={setDiagramCode} 
        onEnhancedCode={setDiagramCode} 
        currentCode={diagramCode} 
      />
      <main className="flex flex-1 flex-col lg:flex-row gap-4 p-4 overflow-hidden">
        <div className="flex flex-col lg:w-1/3 min-h-0 h-full overflow-y-auto">
          <DiagramEditor
            code={diagramCode}
            onCodeChange={setDiagramCode}
          />
        </div>
        <div className="flex flex-1 flex-col lg:w-2/3 min-h-0 h-full">
          {isMounted && (
            <DiagramViewer
              code={diagramCode}
              theme={theme}
              setTheme={setTheme}
            />
          )}
        </div>
      </main>
    </div>
  );
}
