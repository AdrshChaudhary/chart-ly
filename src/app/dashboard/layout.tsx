
"use client";

import * as React from 'react';
import Header from '@/components/header';
import { Sidebar, SidebarProvider, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Settings, PanelsTopLeft, Upload, LogOut, History, FileClock } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

type SavedFile = {
  fileName: string;
  timestamp: number;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();
  const [savedFiles, setSavedFiles] = React.useState<SavedFile[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('savedChartlyFiles');
    if (saved) {
      setSavedFiles(JSON.parse(saved));
    }
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    router.push("/login");
  };

  const loadPreviousFile = (fileName: string) => {
    router.push(`/dashboard?load=${encodeURIComponent(fileName)}`);
  }

  if (!user) {
    // This can be a loading spinner or null
    return null;
  }
  
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-dvh bg-muted/40">
        <Header />
        <div className="flex flex-1">
          <Sidebar className="hidden md:flex md:flex-col md:border-r">
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton href="/dashboard" isActive={pathname === '/dashboard'}>
                    <PanelsTopLeft />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton href="/dashboard/upload" isActive={pathname.startsWith('/dashboard/upload')}>
                    <Upload />
                    <span>Upload Data</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton href="#">
                        <Settings />
                        <span>Settings</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
               {savedFiles.length > 0 && (
                <div className="px-4 mt-6">
                  <h3 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    <History className="h-4 w-4" />
                    History
                  </h3>
                  <SidebarMenu>
                    {savedFiles.map((file) => (
                       <SidebarMenuItem key={file.fileName}>
                         <SidebarMenuButton 
                            href={`/dashboard?load=${encodeURIComponent(file.fileName)}`}
                            isActive={pathname === `/dashboard?load=${encodeURIComponent(file.fileName)}`}
                            className="text-sm"
                          >
                           <FileClock className="h-4 w-4" />
                           <span className="truncate">{file.fileName}</span>
                         </SidebarMenuButton>
                       </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </div>
              )}
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleSignOut}>
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <div className="flex flex-col flex-1">
            <main className="flex-1 p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
