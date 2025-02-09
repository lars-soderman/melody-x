import { AuthProvider } from '@/contexts/AuthContext';

import type { Metadata } from 'next';
import { Creepster } from 'next/font/google';
import localFont from 'next/font/local';
import { Suspense } from 'react';

import { Topnav } from '@/components/layout/Topnav';
import { Toast } from '@/components/ui/Toast';
import './globals.css';

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const creepster = Creepster({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-creepster',
});

export const metadata: Metadata = {
  title: 'Melodikrysstvå',
  description: 'Gör ditt eget melodikryss!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${creepster.variable} absolute inset-0 antialiased`}
      >
        <AuthProvider>
          {/* <Topnav /> */}
          <div className="flex flex-col">
            <Topnav />
            <div className="flex-1">{children}</div>
            <Suspense>
              <Toast />
            </Suspense>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
