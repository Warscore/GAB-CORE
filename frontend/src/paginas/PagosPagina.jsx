import React from 'react';
import ResumenCarrito from '../componentes/pagos/ResumenCarrito';
import Pasarela from '../componentes/pagos/Pasarela';

export default function PagosPagina({ usuario, carrito, alModificarCantidad, alQuitarItem, alVaciarCarrito }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <ResumenCarrito
        carrito={carrito}
        alModificarCantidad={alModificarCantidad}
        alQuitarItem={alQuitarItem}
        alVaciarCarrito={alVaciarCarrito}
      />
      <Pasarela usuario={usuario} carrito={carrito} alPagoExitoso={alVaciarCarrito} />
    </div>
  );
}
