
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadCloud, Bot, BarChart } from 'lucide-react';
import Header from '@/components/header';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
              Create Dynamic Dashboards with AI
            </h1>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mb-8">
              Effortlessly transform your data files into insightful, Power BI-like dashboards. Just upload your data, and let our AI do the heavy lifting.
            </p>
            <Link href="/signup">
              <Button size="lg">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="text-muted-foreground">A simple three-step process to visualize your data.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <UploadCloud className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">1. Upload Your Data</h3>
                  <p className="text-muted-foreground">
                    Securely upload your CSV, XLSX, or JSON files. Your data is encrypted and private.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">2. AI Analysis</h3>
                  <p className="text-muted-foreground">
                    Our intelligent engine analyzes your data structure and content to find key insights.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">3. Dynamic Dashboard</h3>
                  <p className="text-muted-foreground">
                    Instantly receive a beautiful, interactive dashboard with charts and graphs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to Visualize Your Data?</h2>
            <p className="text-muted-foreground mb-8">
              Sign up now and get your first AI-generated dashboard in minutes.
            </p>
            <Link href="/signup">
                <Button size="lg">
                    Start Your Free Trial
                </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="text-center py-4 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Chartly. All rights reserved.</p>
      </footer>
    </div>
  );
}
