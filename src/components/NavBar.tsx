'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar, NavbarContent, NavbarBrand, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenuItem, NavbarMenu } from '@nextui-org/react';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddIcon from '@mui/icons-material/Add';

const NavBar = () => {
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
      <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className='flex justify-center w-full'>
        <NavbarBrand>
            <Link color="foreground" href="/home/cooperativa">
                <p className="font-bold text-inherit">LOGO APP</p>
            </Link>
        </NavbarBrand>

        <NavbarContent className="ml-14 hidden sm:block sticky-bottom w-full items-center text-center h-1/2" justify="end">
          <div className='flex flex-row items-center self-center gap-12'>
            <NavbarItem isActive={isActiveRoute('/home/cooperativa')} className='w-8'>
            <Link color="foreground" href="/home/cooperativa">
              <HomeIcon fontSize='large'/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/pedidos')} className='w-10'>
            <Link color="foreground" href="/home/cooperativa/pedidos" >
                <ReceiptIcon fontSize='large'/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/pedidos/crear')}  className='w-10'>
            <Link color="foreground" href="/home/cooperativa/pedidos/crear">
                <AddIcon fontSize='large'/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/perfil')} className='w-10'>
            <Link color="foreground" href="/home/cooperativa/perfil">
                <AccountBoxIcon fontSize='large'/>
            </Link>
            </NavbarItem>

            <NavbarMenuToggle className="text-lg h-10 text-black" aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
            </div>
        </NavbarContent>

        <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === menuItems.length - 1 ? "danger" : "black"
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

export default NavBar;
