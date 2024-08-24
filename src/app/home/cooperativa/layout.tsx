import { NextUIProvider, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react';
import NavBar  from "../../../components/NavBar";
import React from 'react';
import NavBarMobile from '../../../components/NavBarMobile';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextUIProvider>
        <NavBar />
      <div>
        {children}
      </div>
        <NavBarMobile />
    </NextUIProvider>
  );
}
