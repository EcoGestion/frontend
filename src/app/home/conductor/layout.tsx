import { NextUIProvider, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react';
import NavBarConductor from './components/NavBarConductor';
import NavBarMobileConductor from './components/NavBarMobileConductor';
import React from 'react';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextUIProvider>
      <NavBarConductor />
      <div className='bg-background-color'>
        {children}
      </div>
      <NavBarMobileConductor />
    </NextUIProvider>
  );
}
