import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from "@/components/ui/toaster";
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Chartly',
  description: 'Upload data and create charts instantly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} antialiased flex flex-col min-h-dvh`}>
        <AuthProvider>
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
