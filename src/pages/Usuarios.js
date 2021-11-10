
import React, { useEffect, useState } from "react";
import {
    Redirect
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function Usuarios() {
    let [loggedUser, setLoggedUser] = useState(
        localStorage.getItem('usuario') ?
            JSON.parse(localStorage.getItem('usuario')) :
            null
    );
    let [token, setToken] = useState(true);
    let [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const tokenStorage = localStorage.getItem('token');
        if (tokenStorage && loggedUser.rol === "Administrador") {

            fetch('https://aqueous-reef-57891.herokuapp.com/usuarios', {
                headers: {
                    'Content-Type': 'application/json',
                    token: tokenStorage
                }
            }).catch((err) => console.error(err))
                .then((response) => response.json())
                .then((usuarios) => {

                    setUsuarios(usuarios.usuarios);
                });
        } else {
            alert('Usted no esta autorizado');
            setToken(false);
        }
    }, []);

   


    function actualizarUsuario(e, usuario) {
        // Llamar al servidor
        const tokenStorage = localStorage.getItem('token');
        const rol = e.target.value;
        fetch('https://aqueous-reef-57891.herokuapp.com/actualizarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: tokenStorage
            },
            body: JSON.stringify({
                email: usuario.email,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                rol: rol
            })
        }).catch((err) => console.error(err))
            .then((response) => response.json())
            .then((usuarios) => {
                //alert('El usuario fue actualizado con exito');
                toast.success('Usuario Actualizado exitosamente');
            });
    }

    return (
    <div className='flex h-full w-full flex-col items-center justify-start p-10 '>
    <div className='flex flex-col w-full'>

      <div className='flex flex-col'>
            {!token && <Redirect to='/Login' />}
            <h2 className='text-2xl text-center font-mono font-bold text-yellow-900'> LISTAR USUARIOS</h2>
            <div className='hidden md:flex w-full'>
            <table className='tabla'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Rol</th>
                        <th>Actualizar</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        usuarios.map((usuario) =>
                            <tr key={usuario._id}>
                                <td>{usuario._id.slice(20)}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.rol}</td>
                                <td>
                                    <select onChange={(e) => { actualizarUsuario(e, usuario) }} value={usuario.rol}>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Vendedor">Vendedor</option>
                                        <option value="Pendiente">Pendiente</option>
                                    </select>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            </div>
        </div>
        <ToastContainer position='bottom-center' autoClose={3000} />
        </div>
        </div>
        

    )
}

export default Usuarios;
