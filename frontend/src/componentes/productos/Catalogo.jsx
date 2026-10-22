import React from 'react';
import TarjetaProducto from './TarjetaProducto';

export default function Catalogo({ productos, alAgregar }) {
  return (
    <div className="gd">
      {productos.map(p => (
        <TarjetaProducto key={p.id} producto={p} alAgregar={alAgregar} />
      ))}
    </div>
  );
}
