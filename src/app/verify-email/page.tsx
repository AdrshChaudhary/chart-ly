import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <MailCheck className="h-16 w-16 text-green-500" />
            </div>
          <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
          <CardDescription>We've sent a verification link to your email address. Please click the link to verify your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already verified?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
