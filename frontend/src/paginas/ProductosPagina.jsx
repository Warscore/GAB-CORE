import React from 'react';
import Catalogo from '../componentes/productos/Catalogo';
export default function ProductosPagina({ productos, alAgregar, busqueda }) {
  return <Catalogo productos={productos} alAgregar={alAgregar} terminoBusq={busqueda} />;
}
