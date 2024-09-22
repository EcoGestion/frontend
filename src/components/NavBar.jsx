'use client'
import React from 'react';
import { Navbar, NavbarContent, NavbarBrand, NavbarItem, Button, NavbarMenuToggle, NavbarMenuItem, NavbarMenu } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddIcon from '@mui/icons-material/Add';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MenuRoundedIcon from '@mui/icons-material/Menu';
import { useUser } from '../state/userProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../app/firebaseConfig';

const NavBar = () => {
    const currentPath = usePathname();
    const router = useRouter();
    const { setUser } = useUser();

    const handleGoBack = () => {
      console.log(currentPath.includes("/pedidos/detalles"))
      if(currentPath.includes("/pedidos/detalles"))
        router.replace(currentPath.split('/').slice(0, -2).join('/'))
      else
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
      <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className='flex space-between  items-center text-center gap-10 w-100 '>
        <button onClick={handleGoBack} className={`justify-self-start ${currentPath == "/home/cooperativa" ? "hidden" : "block"}`}>
          <KeyboardBackspaceIcon className='text-3xl'/>
        </button>

        <NavbarContent className={`ml-14 hidden sm:block sticky-bottom w-full items-center text-center h-1/2 justify-self-center ${currentPath == "/home/cooperativa" ? "translate-x-7" : ""}`} justify="center">
          <div className='flex flex-row items-center space-between justify-center gap-12'>
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

            <NavbarItem onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 items-center cursor-pointer">
              <MenuRoundedIcon fontSize='large'/>
            </NavbarItem>

            </div>
        </NavbarContent>

        <NavbarBrand className='justify-end '>
            <Link color="foreground" href="/home/cooperativa">
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

export default NavBar;
