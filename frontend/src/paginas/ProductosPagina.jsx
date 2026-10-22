import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import Catalogo from '../componentes/productos/Catalogo';

export default function ProductosPagina({ busqueda, alAgregar }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/productos`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setProductos(data); })
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  const visibles = productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  const agregar = (producto) => {
    alAgregar(producto);
    alert('Agregado al carrito');
  };

  return <Catalogo productos={visibles} alAgregar={agregar} />;
}
