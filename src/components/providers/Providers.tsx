"use client";

import { AuthProvider } from './AuthProvider';
import { SidebarProvider } from './SidebarProvider';
import { ScrollProvider } from './ScrollProvider';
import LayoutProvider from './LayoutProvider';
import GridBackground from '@/components/effects/GridBackground';
import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <AuthProvider>
      <ScrollProvider>
        <GridBackground />
        {isAdminRoute ? (
          <SidebarProvider>
            {children}
          </SidebarProvider>
        ) : (
          <LayoutProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </LayoutProvider>
        )}
      </ScrollProvider>
    </AuthProvider>
  );
} 