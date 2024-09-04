'use client'
import 'bootstrap/dist/css/bootstrap.css';
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from 'react-redux';
import { store, persistor } from '../state/store';
import { PersistGate } from 'redux-persist/integration/react';
import {NextUIProvider} from '@nextui-org/react'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NextUIProvider>
              {children}
            </NextUIProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}