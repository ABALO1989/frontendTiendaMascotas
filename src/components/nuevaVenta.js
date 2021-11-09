import { nanoid } from 'nanoid';
import React, { useState, useEffect, useRef } from 'react';
import { crearVenta } from '../api';
import { obtenerProductos } from '../api';
import { obtenerUsuarios } from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const NuevaVenta = () => {
  
  const [vendedores, setVendedores] = useState([]);
  const [productos,setProductos] = useState([]);
  const [productosTabla,setProductosTabla] = useState([]);
  const [mostrarTabla, setMostrarTabla] = useState(true);
  const [textoBoton, setTextoBoton] = useState('Crear Nueva venta');
 

  useEffect(() => {
    const fetchVendedores = async () => {
      await obtenerUsuarios(
        (response) => {
          setVendedores(response.data);
        },
        (error) => {
          console.error(error);
        }
      );
    };
    const fetchProductos = async () => {
      await obtenerProductos(
        (response) => {
         setProductos(response.data);
        },
        (error) => {
          console.error(error);
        }
      );
    };

    fetchVendedores();
    fetchProductos();
  }, []);


  useEffect(() => {
    if (mostrarTabla) {
      setTextoBoton('Crear Nuevo Producto');
    } else {
      setTextoBoton('Mostrar Todos los Productos');

    }
  }, [mostrarTabla]);

  const form = useRef(null);



  const submitForm = async (e) => {
      
    e.preventDefault();
    const fd = new FormData(form.current);

    const nuevaVenta = {};
    fd.forEach((value, key) => {
      nuevaVenta[key] = value;
    });


    const listaProductos = Object.keys(nuevaVenta)
      .map((k) => {
        if (k.includes('producto')) {
          return productosTabla.filter((v) => v._id === nuevaVenta[k])[0];
        }
        return null;
      })
      .filter((v) => v);

   

    await crearVenta({
      vendedor: vendedores.filter((v) => v._id === nuevaVenta.vendedor)[0],
      cantidad: nuevaVenta.valorTotal,
      productos: listaProductos,
      IDcliente: nuevaVenta.IDcliente,
      nombreCliente: nuevaVenta.nombreCliente,
      fechaVenta: nuevaVenta.fechaVenta,
      valorTotal:nuevaVenta.valorTotal,
    

    },
      
      (response) => {
        console.log(response);
        toast.success('Venta agregada con éxito');
      },
      (error) => {
        console.error(error);
        toast.error('Error creando una Venta' + error);
      }
    );
    setMostrarTabla(true);
  };

  return (
    <div className='flex h-full w-full items-center justify-center '>
      <form ref={form} onSubmit={submitForm} className='flex flex-col h-full font-mono text-yellow-900'>
        <h1 className='text-xl font-bold  my-3'>CREAR NUEVA VENTA</h1>
        <label className='flex flex-col' htmlFor='fechaVenta'>
          <span className='text-l font-gray-900'>Fecha Venta</span>
          <input
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='date'
            name='fechaVenta'
            required
          />
        </label>
        <label className='flex flex-col' htmlFor='IDcliente'>
          <span className='text-l font-gray-900'>ID Cliente</span>
          <input
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='text'
            name='IDcliente'
            required
          />
        </label>
        <label className='flex flex-col' htmlFor='nombreCliente'>
          <span className='text-l font-gray-900'>Nombre Cliente</span>
          <input
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='text'
            name='nombreCliente'
            required
          />
        </label>
        
        <label className='flex flex-col' htmlFor='vendedor'>
          <select name='vendedor' className='p-2' defaultValue='' required>
            <option disabled value=''>
              Seleccione un Vendedor
            </option>
            {vendedores.map((el) => {
              return <option key={nanoid()} value={el._id}>{`${el.email}`}</option>;
            })}
          </select>
        </label>

        <TablaProductos
        productos={productos}
         setProductos={setProductos}
         setProductosTabla={setProductosTabla}
        />

        <label className='flex flex-col'>
          <span className='text-l pt-3 font-gray-900'>Valor Total Venta</span>
          <input
            className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
            type='number'
            name='valorTotal'
            required
          />
        </label>
        <button
          type='submit'
          className='col-span-2 bg-green-400 p-2 pb-6 rounded-xl shadow-md hover:bg-green-600 text-white'
        >
          Crear Venta
        </button>
      </form>
    </div>
  );
};

const TablaProductos = ({ productos,setProductos,setProductosTabla }) => {
  const [productoAAgregar, setProductoAAgregar] = useState({});
  const [filasTabla, setFilasTabla] = useState([]);

  useEffect(() => {
   setProductosTabla(filasTabla);
  }, [filasTabla,setProductosTabla]);

  const agregarNuevoProducto = () => {
    setFilasTabla([...filasTabla, productoAAgregar]);
   setProductos(productos.filter((v) => v._id !== productoAAgregar._id));
    setProductoAAgregar({});
  };

  const eliminarProducto = (productoAEliminar) => {
    setFilasTabla(filasTabla.filter((v) => v._id !== productoAEliminar._id));
   setProductos([...productos, productoAEliminar]);
  };

  const modificarProducto = (producto, cantidad) => {
    setFilasTabla(
      filasTabla.map((ft) => {
        if (ft._id === producto.id) {
          ft.cantidad = cantidad;
          ft.total = producto.valor * cantidad;
        }
        return ft;
      })
    );
  };

  return (
    <div>
      <div className='flex '>
        <label className='flex flex-col mr-8' htmlFor='producto'>
          <select
            className='p-2'
            value={productoAAgregar._id ?? ''}
            onChange={(e) =>
              setProductoAAgregar(productos.filter((v) => v._id === e.target.value)[0])
            }
          >
            <option disabled value=''>
              Seleccione un Producto
            </option>
            {productos.map((el) => {
              return (
                <option
                  key={nanoid()}
                  value={el._id}
                >{` ${el.valorUnitario} ${el.estado}`}</option>
              );
            })}
          </select>
        </label>
        <button
          type='button'
          onClick={() => agregarNuevoProducto()}
          className='col-span-2 bg-green-400 p-2 rounded-xl font-bold shadow-md hover:bg-green-600 text-white'
        >
          Agregar Producto
        </button>
      </div>
      <table className='tabla'>
        <thead>
          <tr>
          <th>ID Venta</th>
            <th>Valor Unitario</th>
            <th>Estado</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Eliminar</th>
            
          </tr>
        </thead>
        <tbody>
          {filasTabla.map((el, index) => {
            return (
              <FilaProducto
                key={el._id}
                prod={el}
                index={index}
                eliminarProducto={eliminarProducto}
                modificarProducto={modificarProducto}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const FilaProducto = ({ prod, index, eliminarProducto, modificarProducto }) => {
  const [producto, setProducto] = useState(prod);
  useEffect(() => {
    console.log('prod', producto);
  }, [producto]);
  return (
    <tr>
      <td>{producto._id}</td>
      <td>{producto.valorUnitario}</td>
      <td>{producto.estado}</td>
      <td>
        <label htmlFor={`valor_${index}`}>
          <input
            type='number'
            name={`cantidad_${index}`}
            value={producto.cantidad}
            onChange={(e) => {
              modificarProducto(producto, e.target.value === '' ? '0' : e.target.value);
              setProducto({
                ...producto,
                cantidad: e.target.value === '' ? '0' : e.target.value,
                total:
                  parseFloat(producto.valorUnitario) *
                  parseFloat(e.target.value === '' ? '0' : e.target.value),
              });
            }}
          />
        </label>
      </td>
      
      <td>{parseFloat(producto.total ?? 0)}</td>
      <td>
        <i
          onClick={() => eliminarProducto(producto)}
          className='fas fa-minus text-red-500 cursor-pointer'
        />
      </td>
      <td className='hidden'>
        <input hidden defaultValue={producto._id} name={`producto_${index}`} />
      </td>
    </tr>
  );
};

export default NuevaVenta;