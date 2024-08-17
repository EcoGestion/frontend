import { NextUIProvider, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react';
import NavBar  from "./components/NavBar";

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
    </NextUIProvider>
  );
}
