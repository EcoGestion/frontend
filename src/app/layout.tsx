import 'bootstrap/dist/css/bootstrap.css';
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/app_buttons.css";
import "./styles/app_forms.css";
import {NextUIProvider} from '@nextui-org/react'
import { UserProvider } from '../state/userProvider'
import React from 'react';
import type { Metadata } from "next";
import ReduxProvider from './ReduxProvider';

export const metadata: Metadata = {
    title: "EcoGestion",
    description: "Conectando cooperativas con generadores",
};

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
            <NextUIProvider>
              {children}
            </NextUIProvider>
        </ReduxProvider>
      </body>
    </html>
    </UserProvider>
  );
}