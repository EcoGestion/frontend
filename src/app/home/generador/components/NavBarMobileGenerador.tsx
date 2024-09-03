'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenuItem, NavbarMenu } from '@nextui-org/react';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddIcon from '@mui/icons-material/Add';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

const NavBarMobileGenerador = () => {
    const currentPath = usePathname();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = [
        "Configuración",
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback",
        "Cerrar Sesión",
      ];

    const isActiveRoute = (route: string) => {
        return currentPath === route;
    };

    return (
       <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className='flex bottom-0 justify-center border-1 sm:hidden'>
        <NavbarContent className="flex sm:hidden gap-9 xs:gap-14 sticky-bottom w-full" justify="center">
            <NavbarItem isActive={isActiveRoute('/home/generador')}>
            <Link color="foreground" href="/home/generador">
              <HomeIcon fontSize='large'/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/generador/pagina1')}>
            <Link color="foreground" href="/home/generador/pedidos">
                <ReceiptIcon fontSize='large'/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/generador/pagina1')} >
            <Link color="foreground" href="/home/generador/pedidos/crear">
                <AddIcon fontSize='large'/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/generador/pagina2')}>
            <Link color="foreground" href="/home/generador/perfil">
                <AccountBoxIcon fontSize='large'/>
            </Link>
            </NavbarItem>

            <NavbarMenuToggle className="text-lg w-10 h-10" aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            </NavbarMenuToggle>
        </NavbarContent>

        <NavbarMenu className='text-black'>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

        </Navbar>
    )
};

export default NavBarMobileGenerador;
