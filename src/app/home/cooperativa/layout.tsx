import { NextUIProvider, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react';
import NavBarCooperativa  from "./components/NavBarCooperativa";
import React from 'react';
import NavBarMobileCooperativa from './components/NavBarMobileCooperativa';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextUIProvider>
        <NavBarCooperativa />
      <div className='bg-background-color'>
        {children}
      </div>
        <NavBarMobileCooperativa />
    </NextUIProvider>
  );
}
