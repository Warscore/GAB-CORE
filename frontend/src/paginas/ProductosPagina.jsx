import React from 'react';
import Catalogo from '../componentes/productos/Catalogo';

export default function ProductosPagina({
  productos,
  alAgregar,
  busqueda,
  alCambiarBusqueda,
  cargando,
  error,
}) {
  return (
    <Catalogo
      productos={productos}
      agregarAlCarrito={alAgregar}
      busqueda={busqueda}
      alCambiarBusqueda={alCambiarBusqueda}
      cargando={cargando}
      error={error}
    />
  );
}
