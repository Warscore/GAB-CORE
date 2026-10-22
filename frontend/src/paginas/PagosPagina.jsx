import React from 'react';
import ResumenCarrito from '../componentes/pagos/ResumenCarrito';
import Pasarela from '../componentes/pagos/Pasarela';

export default function PagosPagina({ carrito, vaciarCarrito, actualizarCantidad, eliminarDelCarrito, usuario, API_URL }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
      <ResumenCarrito 
        carrito={carrito} 
        vaciarCarrito={vaciarCarrito} 
        actualizarCantidad={actualizarCantidad} 
        eliminarDelCarrito={eliminarDelCarrito} 
      />
      <Pasarela 
        carrito={carrito} 
        usuario={usuario} 
        API_URL={API_URL} 
        alCompletarPago={() => {
          vaciarCarrito();
        }} 
      />
    </div>
  );
}
