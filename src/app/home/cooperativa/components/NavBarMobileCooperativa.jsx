'use client'
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar, NavbarContent, NavbarItem, Button, NavbarMenuToggle, NavbarMenuItem, NavbarMenu } from '@nextui-org/react';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MapIcon from '@mui/icons-material/Map';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useUser } from '../../../../state/userProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../../../../app/firebaseConfig';

const NavBarMobileCooperativa = () => {
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
            <NavbarItem isActive={isActiveRoute('/home/cooperativa')}>
            <Link color="foreground" href="/home/cooperativa">
              <HomeIcon fontSize='large' color={isActiveRoute('/home/cooperativa') ? 'success':''}/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/pedidos')}>
            <Link color="foreground" href="/home/cooperativa/pedidos">
                <ReceiptIcon fontSize='large' color={isActiveRoute('/home/cooperativa/pedidos') ? 'success':''}/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/rutas')}>
            <Link color="foreground" href="/home/cooperativa/rutas">
                <MapIcon fontSize='large' color={isActiveRoute('/home/cooperativa/rutas') ? 'success':''}/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/reportes')}>
            <Link color="foreground" href="/home/cooperativa/reportes">
                <AssessmentIcon fontSize='large' color={isActiveRoute('/home/cooperativa/reportes') ? 'success':''}/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/recursos')}>
            <Link color="foreground" href="/home/cooperativa/recursos">
                <LocalShippingIcon fontSize='large' color={isActiveRoute('/home/cooperativa/recursos') ? 'success':''}/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/perfil')}>
            <Link color="foreground" href="/home/cooperativa/perfil">
                <AccountBoxIcon fontSize='large' color={isActiveRoute('/home/cooperativa/perfil') ? 'success':''}/>
            </Link>
            </NavbarItem>
        </NavbarContent>

        </Navbar>
    )
};

export default NavBarMobileCooperativa;
