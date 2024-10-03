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
      {key:1,  name: 'Inicio', route: '/home/cooperativa' },
      {key:2,  name: 'Solicitudes', route: '/home/cooperativa/pedidos' },
      {key:3,  name: 'Rutas', route: '/home/cooperativa/rutas' },
      {key:4,  name: 'Reportes', route: '/home/cooperativa/reportes' },
      {key:5,  name: 'Recursos', route: '/home/cooperativa/recursos' },
      {key:6,  name: 'Perfil', route: '/home/cooperativa/perfil' },
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

            <NavbarItem onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 items-center cursor-pointer">
              <MenuRoundedIcon fontSize='large'/>
            </NavbarItem>
        </NavbarContent>

        <NavbarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={item.key}>
            <Link
              className="w-full"
              color={"foreground"}
              href={item.route}
              size="lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
          <NavbarMenuItem key={`Cerrar Sesión-9`} className='mt-5'>
            <a
              className="logout-button w-full text-lg justify-start"
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

export default NavBarMobileCooperativa;
