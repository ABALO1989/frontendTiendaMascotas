
import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LayoutUsuarios = ({children}) => {
    return (
        <div className='flex flex-col justify-between h-screen'>
            <Navbar/>
            <main className='h-full overflow-y-scroll'>{children}</main>
            <Footer />
        </div>
    )
}

export default LayoutUsuarios
