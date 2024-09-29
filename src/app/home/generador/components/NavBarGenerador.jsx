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
import BarChartIcon from '@mui/icons-material/BarChart';
import { useUser } from '../../../../state/userProvider';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebaseConfig';

const NavBar = () => {
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
      {key:1,  name: 'Inicio', route: '/home/generador' },
      {key:2,  name: 'Solicitudes', route: '/home/generador/pedidos' },
      {key:3,  name: 'Reportes', route: '/home/generador/estadisticas' },
      {key:4,  name: 'Perfil', route: '/home/generador/perfil' },
    ];

    const isActiveRoute = (route) => {
        return currentPath === route;
    };

    return (
      <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className='flex space-between  items-center text-center gap-10 w-100'>
        <button onClick={handleGoBack} className={`justify-self-start ${currentPath == "/home/generador" ? "hidden" : "block"}`}>
          <KeyboardBackspaceIcon className='text-3xl'/>
        </button>

        <NavbarContent className={`ml-14 hidden sm:block sticky-bottom w-full items-center text-center h-1/2 justify-self-center ${currentPath == "/home/generador" ? "translate-x-7" : ""}`} justify="center">
          <div className='flex flex-row items-center space-between justify-center gap-28'>
            
            <NavbarItem isActive={isActiveRoute('/home/generador')} className='w-8'>
            <Link color="foreground" href="/home/generador">
                <div className="flex flex-col items-center">
                  <HomeIcon fontSize='medium' color={isActiveRoute('/home/generador') ? 'success':''}/>
                  <span className="text-sm text-black">Inicio</span>
                </div>
              </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/generador/pedidos/crear')}  className='w-10'>
            <Link color="foreground" href="/home/generador/pedidos/crear">
                <div className="flex flex-col items-center">
                    <AddIcon fontSize='medium' color={isActiveRoute('/home/generador/pedidos/crear') ? 'success':''}/>
                    <span className="text-sm text-black">Nueva solicitud</span>
                  </div>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/generador/pedidos')} className='w-10'>
            <Link color="foreground" href="/home/generador/pedidos" >
                <div className="flex flex-col items-center">
                  <ReceiptIcon fontSize='medium' color={isActiveRoute('/home/generador/pedidos') ? 'success':''}/>
                  <span className="text-sm text-black">Historial de solicitudes</span>
                </div>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/generador/estadisticas')} className='w-10'>
            <Link color="foreground" href="/home/generador/estadisticas" >
                <div className="flex flex-col items-center">
                  <BarChartIcon fontSize='medium' color={isActiveRoute('/home/generador/estadisticas') ? 'success':''}/>
                  <span className="text-sm text-black">Estadisticas</span>
                </div>
            </Link>
            </NavbarItem>

            <NavbarItem isActive={isActiveRoute('/home/generador/perfil')} className='w-10'>
            <Link color="foreground" href="/home/generador/perfil">
              <div className="flex flex-col items-center">
                <AccountBoxIcon fontSize='medium' color={isActiveRoute('/home/generador/perfil') ? 'success':''}/>
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
            <Link color="foreground" href="/home/generador">
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

export default NavBar;
