
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MailCheck } from 'lucide-react';
import { ChartLine } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-muted/40 p-4">
       <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <ChartLine className="h-6 w-6 text-primary" />
            <span className="text-foreground">Chartly</span>
          </Link>
        </div>
      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <div className="flex justify-center mb-4">
                <MailCheck className="h-16 w-16 text-green-500" />
            </div>
          <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
          <CardDescription>We've sent a verification link to your email address. Please click the link in the email to complete your sign-up.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive an email? Check your spam folder or contact support.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
            <Link href="/login" className="font-semibold text-primary hover:underline text-sm">
              Back to Sign In
            </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
