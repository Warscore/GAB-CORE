import React from 'react';
import Pasarela from '../componentes/pagos/Pasarela';

export default function PagosPagina({
  carrito,
  usuario,
  alModificarCantidad,
  alQuitarItem,
  alVaciarCarrito,
  alCompletarPago,
}) {
  return (
    <Pasarela
      carrito={carrito}
      usuario={usuario}
      actualizarCantidad={alModificarCantidad}
      eliminarDelCarrito={alQuitarItem}
      vaciarCarrito={alVaciarCarrito}
      alCompletarPago={alCompletarPago}
    />
  );
}
