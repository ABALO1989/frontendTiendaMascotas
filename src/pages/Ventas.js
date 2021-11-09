import { nanoid } from 'nanoid';
import React, { useState, useEffect } from 'react';
import { obtenerVentas, editarVenta, eliminarVenta } from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import { Dialog, Tooltip } from '@material-ui/core';
import NuevaVenta from '../components/nuevaVenta';

const Ventas = () => {

    const [mostrarTabla, setMostrarTabla] = useState(true);
    const [textoBoton, setTextoBoton] = useState('Crear Nueva venta');
    const [ejecutarConsulta, setEjecutarConsulta] = useState(true);
    const [loading, setLoading] = useState(false);
    const [ventas, setVentas] = useState([])

    //OBTENER VENTAS DESDE EL BACKEND
    useEffect(() => {
        const fetchVentas = async () => {
            setLoading(true);
            await obtenerVentas(
                (response) => {
                    console.log('la respuesta que se recibio fue', response);
                    setVentas(response.data);
                    setEjecutarConsulta(false);
                    setLoading(false);
                },
                (error) => {
                    console.error('Salio un error:', error);
                    setLoading(false);
                }
            );
        };
        console.log('consulta', ejecutarConsulta);
        if (ejecutarConsulta) {
            fetchVentas();
        }
    }, [ejecutarConsulta]);

    useEffect(() => {
        //obtener lista de ventas desde el backend
        if (mostrarTabla) {
            setEjecutarConsulta(true);
        }
    }, [mostrarTabla]);



    useEffect(() => {
        if (mostrarTabla) {
            setTextoBoton('Crear Nueva Venta');
        } else {
            setTextoBoton('Mostrar Todos las Ventas');

        }
    }, [mostrarTabla]);


    return (

        <div className='flex h-full w-full flex-col items-center justify-start p-10 '>
            <div className='flex flex-col w-full'>
                <div className='flex flex-col'>
                    <h2 className='text-2xl text-center font-mono font-bold text-yellow-900'>
                        ADMINISTRACIÓN DE VENTAS
                    </h2>

                    <button
                        onClick={() => {
                            setMostrarTabla(!mostrarTabla);
                        }}
                        className={`text-white font-bold bg-yellow-300 p-2 mr-32 mt-20 w-60 hover:bg-red-400 rounded self-end `}
                    >
                        {textoBoton}
                    </button>
                </div>
            </div>
         {mostrarTabla ? (
            <TablaVentas
              loading={loading}
              listaVentas={ventas}
              setEjecutarConsulta={setEjecutarConsulta}
            />
          ) : (
            <NuevaVenta
              setMostrarTabla={setMostrarTabla}
              listaVentas={ventas}
              setProductos={setVentas}
            />
          )}
          <ToastContainer position='bottom-center' autoClose={3000} />
        </div>
    


    )
}

const TablaVentas = ({ loading, listaVentas, setEjecutarConsulta }) => {
    const [busqueda, setBusqueda] = useState('');
    const [ventasFiltradas, setVentasFiltradas] = useState(listaVentas);

    useEffect(() => {
        setVentasFiltradas(
            listaVentas.filter((elemento) => {
                return JSON.stringify(elemento).toLowerCase().includes(busqueda.toLowerCase());
            })
        );
    }, [busqueda, listaVentas]);

    return (
        <div className='flex flex-col items-center justify-center w-5/6 pb-6 '>
            <form >
                <label className='mr-6 mt-10 mb-6 font-mono text-yellow-900 font-bold'>Buscar Venta: </label>
                <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder='IDventa/IDcliente/nombre'
                    className='border-2 border-yellow-900 px-4 py-1 self-start rounded-md focus:outline-none focus:border-yellow-500'

                />
            </form>

            <div className='hidden md:flex w-full'>
                {loading ? (
                    <ReactLoading type='cylon' color='#abc123' height={667} width={375} />
                ) : (
                    <table className='tabla'>
                        <thead>
                            <tr>
                                <th>ID Venta</th>
                                <th>Fecha Venta</th>
                                <th>ID Cliente</th>
                                <th>Nombre Cliente</th>
                                <th>Vendedor</th>
                                <th>Valor Total</th>
                                <th>Estado</th>

                            </tr>
                        </thead>
                        <tbody>
                            {ventasFiltradas.map((venta) => {
                                return (
                                    <FilaVenta
                                        key={nanoid()}
                                        venta={venta}
                                        setEjecutarConsulta={setEjecutarConsulta}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
            <div className='flex flex-col w-full m-2 md:hidden'>
                {ventasFiltradas.map((el) => {
                    return (
                        <div className='bg-gray-400 m-2 shadow-xl flex flex-col p-2 rounded-xl'>
                            <span>{el.fechaVenta}</span>
                            <span>{el.IDcliente}</span>
                            <span>{el.nombreCliente}</span>
                            <span>{el.vendedor}</span>
                            <span>{el.valorTotal}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const FilaVenta = ({ venta, setEjecutarConsulta }) => {
    const [edit, setEdit] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [infoNuevaVenta, setNuevaVenta] = useState({
        _id: venta._id,
        fechaVenta: venta.fechaVenta,
        valorTotal: venta.valorTotal,
        IDproducto: venta.IDproducto,
        IDcliente: venta.IDcliente,
        nombreCliente: venta.nombreCliente,
        vendedor: venta.vendedor,
    });

    const actualizarVenta = async () => {
        //enviar la info al backend

        await editarVenta(
            venta._id,
            {
                valorTotal: infoNuevaVenta.valorTotal,
                IDproducto: infoNuevaVenta.IDproducto,
                fechaVenta: infoNuevaVenta.fechaVenta,
                IDcliente: infoNuevaVenta.IDcliente,
                nombreCliente: infoNuevaVenta.nombreCliente,
                vendedor: infoNuevaVenta.vendedor,
            },
            (response) => {
                console.log(response.data);
                toast.success('Venta modificada con éxito');
                setEdit(false);
                setEjecutarConsulta(true);
            },
            (error) => {
                toast.error('Error modificando la Venta');
                console.error(error);
            }
        );
    };

    const deleteVenta = async () => {
        await eliminarVenta(
            venta._id,
            (response) => {
                console.log(response.data);
                toast.success('venta eliminado con éxito');
                setEjecutarConsulta(true);
            },
            (error) => {
                console.error(error);
                toast.error('Error eliminando el venta');
            }
        );

        setOpenDialog(false);
    };



    return (
        <tr>
            {edit ? (
                <>
                    <td>{infoNuevaVenta._id}</td>
                    <td>
                        <input
                            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                            type='text'
                            value={infoNuevaVenta.fechaVenta}
                            onChange={(e) =>
                                setNuevaVenta({ ...infoNuevaVenta, fechaVenta: e.target.value })
                            }
                        />
                    </td>
                    
                    <td>
                        <input
                            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                            type='text'
                            value={infoNuevaVenta.IDproducto}
                            onChange={(e) =>
                                setNuevaVenta({ ...infoNuevaVenta, IDproducto: e.target.value })
                            }
                        />
                    </td>
                    
                    <td>
                        <input
                            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                            type='text'
                            value={infoNuevaVenta.IDcliente}
                            onChange={(e) =>
                                setNuevaVenta({ ...infoNuevaVenta, IDcliente: e.target.value })
                            }
                        />
                    </td>
                    <td>
                        <input
                            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                            type='text'
                            value={infoNuevaVenta.nombreCliente}
                            onChange={(e) =>
                                setNuevaVenta({ ...infoNuevaVenta, nombreCliente: e.target.value })
                            }
                        />
                    </td>
                    <td>
                        <input
                            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                            type='text'
                            value={infoNuevaVenta.vendedor}
                            onChange={(e) =>
                                setNuevaVenta({ ...infoNuevaVenta, vendedor: e.target.value })
                            }
                        />
                    </td>
                    <td>
                        <input
                            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                            type='text'
                            value={infoNuevaVenta.valorTotal}
                            onChange={(e) =>
                                setNuevaVenta({ ...infoNuevaVenta, valorTotal: e.target.value })
                            }
                        />
                    </td>
                </>
            ) : (
                <>
                    <td>{venta._id.slice(20)}</td>
                    <td>{venta.fechaVenta}</td>
                    <td>{venta.IDcliente}</td>
                    <td>{venta.nombreCliente}</td>
                    <td>{venta.vendedor}</td>
                    <td>{venta.valorTotal}</td>

                    
                </>
            )}

            <td>
                <div className='flex w-full justify-evenly'>
                    {edit ? (
                        <>
                            <Tooltip title='Confirmar Edición' arrow>
                                <i
                                    onClick={() => actualizarVenta()}
                                    className='fas fa-check text-green-700 hover:text-green-500'
                                />
                            </Tooltip>
                            <Tooltip title='Cancelar edición' arrow>
                                <i
                                    onClick={() => setEdit(!edit)}
                                    className='fas fa-ban text-yellow-700 hover:text-yellow-500'
                                />
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip title='Editar Venta' arrow>
                                <i
                                    onClick={() => setEdit(!edit)}
                                    className='fas fa-pencil-alt text-yellow-700 hover:text-yellow-500'
                                />
                            </Tooltip>
                            <Tooltip title='Eliminar Venta' arrow>
                                <i
                                    onClick={() => setOpenDialog(true)}
                                    className='fas fa-trash text-red-700 hover:text-yellow-500'
                                />
                            </Tooltip>
                        </>
                    )}
                </div>

                <Dialog open={openDialog}>
                    <div className='p-8 flex flex-col'>
                        <h1 className='text-gray-900 text-2xl font-bold'>
                            ¿Está seguro de querer eliminar el Venta?
                        </h1>
                        <div className='flex w-full items-center justify-center my-4'>
                            <button
                                onClick={() => deleteVenta()}
                                className='mx-2 px-4 py-2 bg-green-500 text-white hover:bg-green-700 rounded-md shadow-md'
                            >
                                Sí
                            </button>
                            <button
                                onClick={() => setOpenDialog(false)}
                                className='mx-2 px-4 py-2 bg-red-500 text-white hover:bg-red-700 rounded-md shadow-md'
                            >
                                No
                            </button>
                        </div>
                    </div>
                </Dialog>
            </td>
        </tr>
    );
};



export default Ventas;