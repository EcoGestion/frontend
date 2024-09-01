import { NextUIProvider, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react';
import NavBarGenerador  from "./components/NavBarGenerador";
import React from 'react';
import NavBarMobileGenerador from './components/NavBarMobileGenerador';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextUIProvider>
        <NavBarGenerador />
      <div className='bg-background-color'>
        {children}
      </div>
        <NavBarMobileGenerador />
    </NextUIProvider>
  );
}
