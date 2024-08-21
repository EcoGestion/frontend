'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react';

const NavBar = () => {
    const currentPath = usePathname();

    const isActiveRoute = (route: string) => {
        return currentPath === route;
    };

    return (
        <Navbar isBordered>
        <NavbarBrand>
            <Link color="foreground" href="/home/cooperativa">
                <p className="font-bold text-inherit ">LOGO APP</p>
            </Link>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem isActive={isActiveRoute('/home/cooperativa')}>
            <Link color="foreground" href="/home/cooperativa">
                Home
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/pagina1')}>
            <Link color="foreground" href="/home/cooperativa/pagina1">
                Página 1
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/pagina2')}>
            <Link color="foreground" href="/home/cooperativa/pagina2">
                Página 2
            </Link>
            </NavbarItem>
        </NavbarContent>

        <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="/" variant="flat">
            Cerrar Sesión
          </Button>
        </NavbarItem>
        </NavbarContent>

        </Navbar>
    )
};

export default NavBar;
