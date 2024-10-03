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
import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useUser } from '../../../../state/userProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../../../../app/firebaseConfig';

const NavBarCooperativa = () => {
    const currentPath = usePathname();
    const router = useRouter();
    const { setUser } = useUser();

    const handleGoBack = () => {
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
        {key:1,  name: 'Inicio', route: '/home/cooperativa' },
        {key:2,  name: 'Solicitudes', route: '/home/cooperativa/pedidos' },
        {key:3,  name: 'Rutas', route: '/home/cooperativa/rutas' },
        {key:4,  name: 'Reportes', route: '/home/cooperativa/reportes' },
        {key:5,  name: 'Recursos', route: '/home/cooperativa/recursos' },
        {key:6,  name: 'Perfil', route: '/home/cooperativa/perfil' },
      ];

    const isActiveRoute = (route) => {
        return currentPath === route;
    };

    return (
      <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className='flex space-between  items-center text-center gap-10 w-100 max-w-full'>
        <button onClick={handleGoBack} className={`justify-self-start ${currentPath == "/home/cooperativa" ? "hidden" : "block"}`}>
          <KeyboardBackspaceIcon className='text-3xl'/>
        </button>

        <NavbarContent className={`ml-14 hidden sm:block sticky-bottom w-full items-center text-center h-1/2 justify-self-center ${currentPath == "/home/cooperativa" ? "translate-x-7" : ""}`} justify="center">
          <div className='flex flex-row items-center space-between justify-center gap-20'>
            <NavbarItem isActive={isActiveRoute('/home/cooperativa')} className='w-8'>
              <Link color="foreground" href="/home/cooperativa">
                <div className="flex flex-col items-center">
                  <HomeIcon fontSize='medium' className='active_icon' color={isActiveRoute('/home/cooperativa') ? 'success':''}/>
                  <span className="text-sm text-black">Inicio</span>
                </div>
              </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/pedidos')} className='w-10'>
            <Link color="foreground" href="/home/cooperativa/pedidos" >
             <div className="flex flex-col items-center">
                <ReceiptIcon fontSize='medium' color={isActiveRoute('/home/cooperativa/pedidos') ? 'success':''}/>
                <span className="text-sm text-black">Solicitudes</span>
              </div>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/rutas')} className='w-10'>
            <Link color="foreground" href="/home/cooperativa/rutas" >
             <div className="flex flex-col items-center">
                <MapIcon fontSize='medium'color={isActiveRoute('/home/cooperativa/rutas') ? 'success':''}/>
                <span className="text-sm text-black">Rutas</span>
              </div>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/reportes')} className='w-10'>
            <Link color="foreground" href="/home/cooperativa/reportes">
              <div className="flex flex-col items-center">
                <AssessmentIcon fontSize='medium' color={isActiveRoute('/home/cooperativa/reportes') ? 'success':''}/>
                <span className="text-sm text-black">Reportes</span>
              </div>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/recursos')} className='w-10'>
            <Link color="foreground" href="/home/cooperativa/recursos">
              <div className="flex flex-col items-center">
                <LocalShippingIcon fontSize='medium' color={isActiveRoute('/home/cooperativa/recursos') ? 'success':''}/>
                <span className="text-sm text-black">Recursos</span>
              </div>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/cooperativa/perfil')} className='w-10'>
            <Link color="foreground" href="/home/cooperativa/perfil">
              <div className="flex flex-col items-center">
                <AccountBoxIcon fontSize='medium' color={isActiveRoute('/home/cooperativa/perfil') ? 'success':''}/>
                <span className="text-sm text-black">Perfil</span>
              </div>
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

export default NavBarCooperativa;
