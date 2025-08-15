
"use client";

import * as React from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import Header from '@/components/header';
import { Settings, PanelsTopLeft, FileUp } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <SidebarProvider>
        <div className="flex flex-col min-h-screen bg-secondary/50">
            <Header />
            <div className="flex flex-1">
                <Sidebar>
                    <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/dashboard" isActive={pathname === '/dashboard'} tooltip="Overview">
                                <PanelsTopLeft />
                                <span>Overview</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/dashboard/upload" isActive={pathname === '/dashboard/upload'} tooltip="Upload Data">
                                <FileUp />
                                <span>Upload Data</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="#" tooltip="Settings">
                                <Settings />
                                <span>Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <SidebarInset>
                    {children}
                </SidebarInset>
            </div>
      </div>
    </SidebarProvider>
  );
}
