
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { Separator } from '@/components/ui/separator';
import { ChartLine } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-muted/40 p-4">
       <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <ChartLine className="h-6 w-6 text-primary" />
            <span className="text-foreground">Chartly</span>
          </Link>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue to your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <LoginForm />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <GoogleSignInButton />
        </CardContent>
        <CardFooter>
            <p className="w-full text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign Up
                </Link>
            </p>
        </CardFooter>
      </Card>
    </main>
  );
}
