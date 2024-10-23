'use client'
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar, NavbarContent, NavbarItem, Button, NavbarMenuToggle, NavbarMenuItem, NavbarMenu } from '@nextui-org/react';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import MapIcon from '@mui/icons-material/Map';
import { useUser } from '../../../../state/userProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

const NavBarMobileConductor = () => {
    const currentPath = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { setUser } = useUser();

    const menuItems = [
        "Configuración",
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback"
      ];

      const logOut = (() => {
        signOut(auth)
        .then(() => {
          setUser({
            name: "",
            email: "",
            userId: null
          });
          router.replace("/")
        })
      })

    const isActiveRoute = (route) => {
        return currentPath === route;
    };

    return (
        <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className='flex bottom-0 justify-center border-1 sm:hidden'>
        <NavbarContent className="flex sm:hidden gap-9 xs:gap-14 sticky-bottom w-full" justify="center">
            <NavbarItem isActive={isActiveRoute('/home/conductor')}>
            <Link color="foreground" href="/home/conductor">
              <HomeIcon fontSize='large' color={isActiveRoute('/home/conductor') ? 'success':''}/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/conductor/rutas')}>
            <Link color="foreground" href="/home/conductor/rutas">
              <MapIcon fontSize='medium' color={isActiveRoute('/home/conductor/rutas') ? 'success':''}/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/conductor/pagina2')}>
            <Link color="foreground" href="/home/conductor/perfil">
                <AccountBoxIcon fontSize='large' color={isActiveRoute('/home/conductor/perfil') ? 'success':''}/>
            </Link>
            </NavbarItem>

            <NavbarItem onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 items-center cursor-pointer">
              <MenuRoundedIcon fontSize='large'/>
            </NavbarItem>
        </NavbarContent>

      <NavbarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={"foreground"}
              href="#"
              size="lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
          <NavbarMenuItem key={`Cerrar Sesión-9`}>
            <a
              className="w-full text-lg justify-start"
              color={"danger"}
              href="#"
              onClick={logOut}
            >
              Cerrar Sesión
            </a>
          </NavbarMenuItem>
      </NavbarMenu>

        </Navbar>
    )
};

export default NavBarMobileConductor;
