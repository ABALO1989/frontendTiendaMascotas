
import Footer from '../components/Footer'
import React from 'react'
import NavbarInicio from '../components/NavbarInicio'

const LayoutInicial = ({children}) => {
    return (
        <div className='h-screen flex flex-col overflow-y-hidden '>
            <NavbarInicio />
            <main className='h-full'>{children}</main>
            <Footer />
        </div>
    )
}

export default LayoutInicial






