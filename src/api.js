import axios from 'axios';




//const baseURL = "http://localhost:4000/api"
const baseURL = 'https://aqueous-reef-57891.herokuapp.com';

//CRUD PARA PRODUCTOS
export const obtenerProductos = async (successCallback, errorCallback) => {
  const options = {
    method: 'GET',
    url: `${baseURL}/api/productos/`,
  
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};


export const crearProducto = async (data, successCallback, errorCallback) => {
  const options = {
    method: 'POST',
    url: `${baseURL}/api/productos/`,
    headers: { 'Content-Type': 'application/json' },
    data,
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};

export const editarProducto= async (id, data, successCallback, errorCallback) => {
  const options = {
    method: 'PUT',
    url: `${baseURL}/api/productos/${id}/`,
    headers: { 'Content-Type': 'application/json' },
    data,
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};

export const eliminarProducto= async (id, successCallback, errorCallback) => {
  const options = {
    method: 'DELETE',
    url: `${baseURL}/api/productos/${id}/`,
    headers: { 'Content-Type': 'application/json' },
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};

//CRUD PARA VENTAS

export const obtenerVentas = async (successCallback, errorCallback) => {
  const options = {
    method: 'GET',
    url: `${baseURL}/api/ventas/`,
  
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};


export const crearVenta = async (data, successCallback, errorCallback) => {
  const options = {
    method: 'POST',
    url: `${baseURL}/api/ventas/`,
    headers: { 'Content-Type': 'application/json' },
    data,
  };
  console.log("error martin"+errorCallback)
  await axios.request(options).then(successCallback).catch(errorCallback);
};

export const editarVenta= async (id, data, successCallback, errorCallback) => {
  const options = {
    method: 'PUT',
    url: `${baseURL}/api/ventas/${id}/`,
    headers: { 'Content-Type': 'application/json' },
    data,
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};

export const eliminarVenta= async (id, successCallback, errorCallback) => {
  const options = {
    method: 'DELETE',
    url: `${baseURL}/api/ventas/${id}/`,
    headers: { 'Content-Type': 'application/json' },
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};


// CRUD PARA USUARIOS

export const obtenerUsuarios = async (successCallback, errorCallback) => {
  const options = {
    method: 'GET',
    url: `${baseURL}/usuarios/self`,
    headers: {
      //Authorization: getToken(),
    },
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};

export const obtenerDatosUsuario = async (successCallback, errorCallback) => {
  const options = {
    method: 'GET',
    url: `${baseURL}/usuarios/self/`,
    headers: {
     // Authorization: getToken(), // 3. enviarle el token a backend
    },
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};

export const editarUsuario = async (id, data, successCallback, errorCallback) => {
  const options = {
    method: 'PUT',
    url: `${baseURL}/usuarios/${id}/`,
    headers: { 'Content-Type': 'application/json', 
    //Authorization: getToken() 
  },
    data,
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};
