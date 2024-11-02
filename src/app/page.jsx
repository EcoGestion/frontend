'use client'
import MonitorIcon from '@mui/icons-material/Monitor';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';
import {Button} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import "./style.css"

const Home = () => {
    const router = useRouter();

    return (
        <div>
            <section id="intro" class="bg-[#057454] xl:h-screen xl:w-full xl:grid xl:grid-cols-intro overflow-hidden ">
            <div class="relative flex flex-col pt-6 xl:pt-8 2xl:pt-14 pb-14 xl:pb-0">
                <div class="container flex flex-col md:flex-row items-center justify-start gap-10">
                    <p className="font-bold text-white text-4xl">EcoGestion</p>
                    <div class="hidden xl:flex items-center gap-14 xl:translate-x-28 text-xl z-40 text-white">
                        <a href="#about" class="text-2xl">Sobre nosotros</a>
                        <a href="#contact" class="text-2xl">Contacto</a>
                    </div>
                    <div className='flex w-full justify-center md:justify-end gap-3'>
                    <Button className='bg-[#034532] text-white text-xl' onClick={() => {router.push("/login")}}> Cooperativa</Button>
                    <Button className='bg-[#034532] text-white text-xl' onClick={() => {router.push("/login/generador")}}> Usuario</Button>
                    </div>
                    
                </div>
                <div class="container xl:h-full md:min-h-[38rem] 2xl:min-h-[45rem] flex flex-col items-center justify-center mt-14 xl:mt-8 2xl:mt-10 xl:-translate-y-12 xl:translate-x-10 2xl:translate-x-52 z-10 ">
                <div class="text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-condensed font-normal italic uppercase max-w-2xl leading-none text-white">
                    Gestión y optimización de residuos
                </div>
                <div class="text-lg xl:text-xl text-white max-w-xl mt-4 xl:mt-6 xl:ml-2 leading-normal">
                    Empoderamos a las cooperativas y generadores de residuos con una plataforma innovadora que optimiza todo el proceso de recolección. Nuestra app facilita la coordinación, con seguimiento en tiempo real, y monitoreo de datos a las recolecciones. Brindamos las herramientas para mejorar la eficiencia operativa y promover la sostenibilidad.
                </div>
                </div>
                <img src="bars-dark.svg" class="dots ospacity-10" alt=""/>
            </div>
            </section>
            <section id="about" class="bg-gray-100">
            <div class="container mx-auto py-12 xl:pt-24 xl:pb-28">
                <h2 class="text-4xl relative block text-center font-condensed italic uppercase mb-7 lg:mb-14">
                <span class="hightlighted font-medium">Sobre nosotros</span>
                </h2>
                <div class="text-lg xl:text-2xl mb-10 max-w-4xl text-center mx-auto">
                Nuestro proposito es transformar la industria de los residuos a traves de una app simple e inteligente que permite la coordinación, monitoreo, cuidado, y recogida basada en:
                </div>
                <div class="grid grid-cols-1 gap-4 xl:gap-8 justify-center">
                <div class="about-card relative flex gap-16 px-8 py-7 xl:px-11 xl:py-9 border text-white overflow-hidden group hover:shadow-public-card transition-all duration-200 items-center">
                    <div>
                    <div class="text-3xl uppercase italic text-white font-medium font-condensed mb-4">Digitalización</div>
                    <div class="text-lg">App mobil y web disponible 24/7 con una poderosa base de datos y un set de herramientas para gestionar la recolección de residuos.</div>
                    </div>
                    <MonitorIcon fontSize='large'/>
                </div>
                <div class="about-card relative flex gap-16 px-8 py-7 xl:px-11 xl:py-9 border text-white overflow-hidden group hover:shadow-public-card transition-all duration-200 items-center">
                    <div>
                    <div class="text-3xl uppercase italic text-white font-medium font-condensed mb-4">Integración</div>
                    <div class="text-lg">Conexión entre cooperativas, conductores, generadores y otros en un ambiente controlado y seguro.</div>
                    </div>
                    <ShareIcon fontSize='large'/>
                </div>
                <div class="about-card relative flex gap-16 px-8 py-7 xl:px-11 xl:py-9 border text-white overflow-hidden group hover:shadow-public-card transition-all duration-200 items-center">
                    <div>
                    <div class="text-3xl uppercase italic text-secondary-color font-condensed font-medium mb-4">Rapidez</div>
                    <div class="text-lg">Coordina la recolección mediante unos clicks, controla el estado constantemente y asegura la entrega de los residuos.</div>
                    </div>
                    <StarIcon fontSize='large'/>
                </div>
                <div class="about-card relative flex gap-16 px-8 py-7 xl:px-11 xl:py-9 border text-white overflow-hidden group hover:shadow-public-card transition-all duration-200 items-center">
                    <div>
                    <div class="text-3xl uppercase italic text-secondary-color font-condensed font-medium mb-4">Información</div>
                    <div class="text-lg">Estadisticas, metricas y reportes sobre diferentes areas para tener una mejor administración</div>
                    </div>
                    <InfoIcon fontSize='large'/>
                </div>
                </div>
            </div>
            </section>
            <section id="contact" class="bg-[#057454] text-white relative overflow-hidden">
                <div class="container mx-auto pt-10 pb-6 xl:pt-24 xl:pb-10">
                    <div class="flex flex-col xl:flex-row xl:items-center gap-7 xl:gap-10 xl:justify-between z-20">
                    <div class="text-2xl xl:text-5xl max-w-xs xl:max-w-xl xl:leading-tight">¡Cambiemos <span class="font-medium">el mundo</span> juntos! Contáctanos</div>
                    <a href="mailto:hello@ecogestion.com" class="text-2xl font-medium xl:text-4xl text-secondary-color">hello@ecogestion.com</a>
                    </div>
                </div>
                <img src="/bars.svg" class="dots mix-blend-multiply z-10" alt=""/>
                <img src="/bars.svg" class="dots right mix-blend-multiply z-10" alt=""/> 
            </section>
        </div>
)}

export default Home;
