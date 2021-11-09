import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../media/logo.png'



const Navbar = () => {
    return (
        <div>
            <ul className="flex justify-around items-center font-mono font-bold  bg-yellow-300 p-2 ">
                <li className="pl-12"> 
                    <img className='h-20'
                    src={logo} 
                    alt='logo'/> 
                </li>
                <li className=" mr-6">
                    <Link className="text-yellow-900 hover:text-red-400" to='/usuarios'>USUARIOS</Link>
                </li>
                <li className="mr-6">
                    <Link className="text-yellow-900 hover:text-red-400 " to='/productos'>PRODUCTOS</Link>
                </li>
                <li className="mr-6">
                    <Link className="text-yellow-900 hover:text-red-400" to='/ventas'>VENTAS</Link>
                </li>

                <li className="mr-6">
                <Link className="text-yellow-900 hover:text-red-400 pr-20" to='/'>SALIR</Link>
                </li>
            </ul>
        </div>
    )
}

export default Navbar
