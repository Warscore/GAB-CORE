import React from 'react';
import ResumenCarrito from '../componentes/pagos/ResumenCarrito';

export default function PagosPagina({ carrito, alVaciar, alProcesarPago }) {
  return <ResumenCarrito carrito={carrito} alVaciar={alVaciar} alProcesarPago={alProcesarPago} />;
}
