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
import { useUser } from '../state/userProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../app/firebaseConfig';

const NavBarMobile = () => {
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

    const isActiveRoute = (route: string) => {
        return currentPath === route;
    };

    return (
        <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className='flex bottom-0 justify-center border-1 sm:hidden'>
        <NavbarContent className="flex sm:hidden gap-9 xs:gap-14 sticky-bottom w-full" justify="center">
            <NavbarItem isActive={isActiveRoute('/home/cooperativa')}>
            <Link color="foreground" href="/home/cooperativa">
              <HomeIcon fontSize='large'/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/pagina1')}>
            <Link color="foreground" href="/home/cooperativa/pedidos">
                <ReceiptIcon fontSize='large'/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/pagina1')} >
            <Link color="foreground" href="/home/cooperativa/pedidos/crear">
                <AddIcon fontSize='large'/>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/pagina2')}>
            <Link color="foreground" href="/home/cooperativa/perfil">
                <AccountBoxIcon fontSize='large'/>
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

export default NavBarMobile;
