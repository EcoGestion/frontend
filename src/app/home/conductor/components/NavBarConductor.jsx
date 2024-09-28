'use client'
import React from 'react';
import { Navbar, NavbarContent, NavbarBrand, NavbarItem, Button, NavbarMenuToggle, NavbarMenuItem, NavbarMenu } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MenuRoundedIcon from '@mui/icons-material/Menu';
import MapIcon from '@mui/icons-material/Map';
import { useUser } from '../../../../state/userProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

const NavBarConductor = () => {
    const currentPath = usePathname();
    const router = useRouter();
    const { setUser } = useUser();

    const handleGoBack = () => {
      router.back();
    };

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

    console.log(currentPath)

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
        "Help & Feedback"
      ];

    const isActiveRoute = (route) => {
        return currentPath === route;
    };

    return (
      <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className='flex space-between  items-center text-center gap-10 w-100'>
        <button onClick={handleGoBack} className={`justify-self-start ${currentPath == "/home/conductor" ? "hidden" : "block"}`}>
          <KeyboardBackspaceIcon className='text-3xl'/>
        </button>

        <NavbarContent className={`ml-14 hidden sm:block sticky-bottom w-full items-center text-center h-1/2 justify-self-center ${currentPath == "/home/conductor" ? "translate-x-7" : ""}`} justify="center">
          <div className='flex flex-row items-center space-between justify-center gap-28'>
            
            <NavbarItem isActive={isActiveRoute('/home/conductor')} className='w-8'>
            <Link color="foreground" href="/home/conductor">
                <div className="flex flex-col items-center">
                  <HomeIcon fontSize='medium' color={isActiveRoute('/home/conductor') ? 'success':''}/>
                  <span className="text-sm text-black">Inicio</span>
                </div>
              </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/conductor/rutas')} className='w-10'>
            <Link color="foreground" href="/home/conductor/rutas" >
                <div className="flex flex-col items-center">
                  <MapIcon fontSize='medium' color={isActiveRoute('/home/conductor/rutas') ? 'success':''}/>
                  <span className="text-sm text-black">Historial de recolecciones</span>
                </div>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/conductor/perfil')} className='w-10'>
            <Link color="foreground" href="/home/conductor/perfil">
              <div className="flex flex-col items-center">
                <AccountBoxIcon fontSize='medium' color={isActiveRoute('/home/conductor/perfil') ? 'success':''}/>
                <span className="text-sm text-black">Perfil</span>
              </div>
            </Link>
            </NavbarItem>

            <NavbarItem onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 items-center cursor-pointer">
              <MenuRoundedIcon fontSize='large'/>
            </NavbarItem>

            </div>
        </NavbarContent>

        <NavbarBrand className='justify-end'>
            <Link color="foreground" href="/home/conductor">
              <p className="font-bold text-green-dark text-lg">EcoGestion</p>
            </Link>
        </NavbarBrand>

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

export default NavBarConductor;
