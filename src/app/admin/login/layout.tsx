'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/components/providers/AuthProvider';

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark">
        {children}
      </div>
    </AuthProvider>
  );
} 