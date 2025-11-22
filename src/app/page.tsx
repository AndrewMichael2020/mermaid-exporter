'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.67-4.05 1.67-3.42 0-6.17-2.84-6.17-6.32 0-3.48 2.75-6.32 6.17-6.32 1.93 0 3.3.73 4.33 1.69l2.5-2.5C18.04.83 15.61 0 12.48 0 7.23 0 3.1 4.14 3.1 9.35c0 5.2 4.13 9.35 9.38 9.35 2.57 0 4.78-.85 6.4-2.5 1.73-1.73 2.5-4.05 2.5-6.85 0-.7-.07-1.35-.2-1.95h-8.6z"
      />
    </svg>
  );

export default function LoginPage() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/viz');
    }
  }, [user, loading, router]);

  if (loading || (!loading && user)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in-50 zoom-in-95">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Code className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Mermaid Cloud Viz</CardTitle>
          <CardDescription>
            Visualize, create, and enhance your Mermaid diagrams with the power of AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={signIn} className="w-full" size="lg">
            <GoogleIcon className="mr-2 h-5 w-5" />
            Sign In with Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
