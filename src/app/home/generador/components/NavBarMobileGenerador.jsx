'use client'
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar, NavbarContent, NavbarItem, Button, NavbarMenuToggle, NavbarMenuItem, NavbarMenu } from '@nextui-org/react';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddIcon from '@mui/icons-material/Add';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useUser } from '../../../../state/userProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

const NavBarMobile = () => {
    const currentPath = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { setUser } = useUser();

    const menuItems = [
      {key:1,  name: 'Inicio', route: '/home/generador' },
      {key:2,  name: 'Solicitudes', route: '/home/generador/pedidos' },
      {key:3,  name: 'Reportes', route: '/home/generador/estadisticas' },
      {key:4,  name: 'Perfil', route: '/home/generador/perfil' },
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
            <NavbarItem isActive={isActiveRoute('/home/generador')}>
            <Link color="foreground" href="/home/generador">
              <HomeIcon fontSize='large' color={isActiveRoute('/home/generador') ? 'success':''}/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/generador/pedidos/crear')} >
            <Link color="foreground" href="/home/generador/pedidos/crear">
                <AddIcon fontSize='large' color={isActiveRoute('/home/generador/pedidos/crear') ? 'success':''}/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/generador/pedidos')}>
            <Link color="foreground" href="/home/generador/pedidos">
                <ReceiptIcon fontSize='large' color={isActiveRoute('/home/generador/pedidos') ? 'success':''}/>
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
              color="danger"
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

export default NavBarMobile;
