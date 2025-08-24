
"use client";

import * as React from 'react';
import Header from '@/components/header';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    // This can be a loading spinner or null
    return null;
  }
  
  return (
      <div className="flex flex-col min-h-dvh bg-muted/40">
        <Header />
        <div className="flex flex-1">
          <div className="flex flex-col flex-1">
            <main className="flex-1 p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </div>
  );
}
