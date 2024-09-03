'use client'
import 'bootstrap/dist/css/bootstrap.css';
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from 'react-redux';
import { store } from '../state/store';
import {NextUIProvider} from '@nextui-org/react'
import { UserProvider } from '../state/userProvider'

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
        <Provider store={store}>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </Provider>
      </body>
    </html>
    </UserProvider>

  );
}
