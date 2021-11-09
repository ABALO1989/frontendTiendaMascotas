import React, { useState, useEffect, useRef } from 'react'
import { obtenerProductos, crearProducto, editarProducto, eliminarProducto } from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from 'react-loading';
import { Dialog, Tooltip } from '@material-ui/core';
import { nanoid } from 'nanoid';


const Productos = () => {

  const [mostrarTabla, setMostrarTabla] = useState(true);
  const [textoBoton, setTextoBoton] = useState('Crear Nueva venta');
  const [ejecutarConsulta, setEjecutarConsulta] = useState(true);
  const [loading, setLoading] = useState(false);

  const [productos, setProductos] = useState([])

  //OBTENER PRODUCTOS DESDE EL BACKEND
  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      await obtenerProductos(
        (response) => {
          console.log('la respuesta que se recibio fue', response);
          setProductos(response.data);
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
      fetchProductos();
    }
  }, [ejecutarConsulta]);

  useEffect(() => {
    //obtener lista de prodductos desde el backend
    if (mostrarTabla) {
      setEjecutarConsulta(true);
    }
  }, [mostrarTabla]);



  useEffect(() => {
    if (mostrarTabla) {
      setTextoBoton('Crear Nuevo Producto');
    } else {
      setTextoBoton('Mostrar Todos los Productos');

    }
  }, [mostrarTabla]);



  return (

    <div className='flex h-full w-full flex-col items-center justify-start p-10 '>
      <div className='flex flex-col w-full'>

        <div className='flex flex-col'>
          <h2 className='text-2xl text-center font-mono font-bold text-yellow-900'>
            ADMINISTRACIÓN DE PRODUCTOS
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
        <TablaProductos
          loading={loading}
          listaProductos={productos}
          setEjecutarConsulta={setEjecutarConsulta}
        />
      ) : (
        <FormularioCreacionProductos
          setMostrarTabla={setMostrarTabla}
          listaProductos={productos}
          setProductos={setProductos}
        />
      )}
      <ToastContainer position='bottom-center' autoClose={3000} />
    </div>

  )
}

const TablaProductos = ({ loading, listaProductos, setEjecutarConsulta }) => {
  const [busqueda, setBusqueda] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState(listaProductos);

  useEffect(() => {
    setProductosFiltrados(
      listaProductos.filter((elemento) => {
        return JSON.stringify(elemento).toLowerCase().includes(busqueda.toLowerCase());
      })
    );
  }, [busqueda, listaProductos]);

  return (
    <div className='flex flex-col items-center justify-center w-5/6 pb-6 '>
      <form >
        <label className='mr-6 mt-10 mb-6 font-mono text-yellow-900 font-bold'>Buscar Producto: </label>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder='ID/ descripcion / valor/'
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
                <th>ID Producto</th>
                <th>Descripción</th>
                <th>Valor Unitario</th>
                <th>Estado</th>
                <th>Acciones</th>

              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => {
                return (
                  <FilaProducto
                    key={nanoid()}
                    producto={producto}
                    setEjecutarConsulta={setEjecutarConsulta}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className='flex flex-col w-full m-2 md:hidden'>
        {productosFiltrados.map((el) => {
          return (
            <div className='bg-gray-400 m-2 shadow-xl flex flex-col p-2 rounded-xl'>
              <span>{el.descripcion}</span>
              <span>{el.valorUnitario}</span>
              <span>{el.estado}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const FilaProducto = ({ producto, setEjecutarConsulta }) => {
  const [edit, setEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [infoNuevoProducto, setInfoNuevoProducto] = useState({
    _id: producto._id,
    descripcion: producto.descripcion,
    valorUnitario: producto.valorUnitario,
    estado: producto.estado,
  });

  const actualizarProducto = async () => {
    //enviar la info al backend

    await editarProducto(
      producto._id,
      {
        descripcion: infoNuevoProducto.descripcion,
        valorUnitario: infoNuevoProducto.valorUnitario,
        estado: infoNuevoProducto.estado,
      },
      (response) => {
        console.log(response.data);
        toast.success('Producto modificado con éxito');
        setEdit(false);
        setEjecutarConsulta(true);
      },
      (error) => {
        toast.error('Error modificando el Producto');
        console.error(error);
      }
    );
  };

  const deleteProducto = async () => {
    await eliminarProducto(
      producto._id,
      (response) => {
        console.log(response.data);
        toast.success('producto eliminado con éxito');
        setEjecutarConsulta(true);
      },
      (error) => {
        console.error(error);
        toast.error('Error eliminando el producto');
      }
    );

    setOpenDialog(false);
  };



  return (
    <tr>
      {edit ? (
        <>
          <td>{infoNuevoProducto._id}</td>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoProducto.descripcion}
              onChange={(e) =>
                setInfoNuevoProducto({ ...infoNuevoProducto, descripcion: e.target.value })
              }
            />
          </td>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoProducto.valorUnitario}
              onChange={(e) =>
                setInfoNuevoProducto({ ...infoNuevoProducto, valorUnitario: e.target.value })
              }
            />
          </td>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoProducto.estado}
              onChange={(e) =>
                setInfoNuevoProducto({ ...infoNuevoProducto, estado: e.target.value })
              }
            />
          </td>
        </>
      ) : (
        <>
          <td>{producto._id.slice(20)}</td>
          <td>{producto.descripcion}</td>
          <td>{producto.valorUnitario}</td>
          <td>{producto.estado}</td>
        </>
      )}

      <td>
        <div className='flex w-full justify-evenly'>
          {edit ? (
            <>
              <Tooltip title='Confirmar Edición' arrow>
                <i
                  onClick={() => actualizarProducto()}
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
              <Tooltip title='Editar Producto' arrow>
                <i
                  onClick={() => setEdit(!edit)}
                  className='fas fa-pencil-alt text-yellow-700 hover:text-yellow-500'
                />
              </Tooltip>
              <Tooltip title='Eliminar Producto' arrow>
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
              ¿Está seguro de querer eliminar el Producto?
            </h1>
            <div className='flex w-full items-center justify-center my-4'>
              <button
                onClick={() => deleteProducto()}
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

const FormularioCreacionProductos = ({ setMostrarTabla }) => {

  const form = useRef(null);

  const submitForm = async (e) => {
    e.preventDefault();
    const fd = new FormData(form.current);

    const nuevoProducto = {};
    fd.forEach((value, key) => {
      nuevoProducto[key] = value;
    });



    await crearProducto(
      {
        descripcion: nuevoProducto.descripcion,
        valorUnitario: nuevoProducto.valorUnitario,
        estado: nuevoProducto.estado
      },
      (response) => {
        console.log(response.data);
        toast.success('Producto agregado con éxito');
      },
      (error) => {
        console.error(error);
        toast.error('Error creando un Producto');
      }
    );

    setMostrarTabla(true);



  };



  return (
    <div>
      <h2 className='text-lg font-bold font-mono text-yellow-900 pb-6 pt-6 text-center'>CREAR NUEVO PRODUCTO </h2>

      <form ref={form} onSubmit={submitForm} className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2 inline-block' >

        <label htmlFor='descripcion'>
          Descripción:
          <input
            className='border border-gray-600 p-2 rounded-lg m-2'
            name='descripcion'
            type="text"
            placeholder='Descripción'
            required

          />
        </label>
        <label htmlFor='valor'>
          Valor:
          <input
            name='valorUnitario'
            className='border border-gray-600 p-2 rounded-lg m-2'
            type='number'
            placeholder='Precio venta'
            required

          />
        </label>
        <label htmlFor='estado'>
          Estado
          <select name="estado"
            className=' border border-gray-600 p-2 rounded-lg m-2'
            required
            defaultValue={0}

          >
            <option disabled value={0}>
              Seleccione una opción
            </option>
            <option>Disponible</option>
            <option>No Disponible</option>
          </select>

        </label>




        <button
          type='submit'
          className='col-span-2 bg-yellow-300 p-2 rounded-md shadow-md hover:bg-red-400 text-white font-bold m-5'
        >
          Guardar
        </button>
      </form>
    </div>
  );
};


export default Productos
