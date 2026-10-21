import React from 'react';
import Pasarela from '../componentes/pagos/Pasarela';
export default function PagosPagina({ carrito, alModificarCantidad, alQuitarItem, alVaciarCarrito }) {
  return <Pasarela carrito={carrito} alModificarCantidad={alModificarCantidad} alQuitarItem={alQuitarItem} alVaciarCarrito={alVaciarCarrito} />;
}
