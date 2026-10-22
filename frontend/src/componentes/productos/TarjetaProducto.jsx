import React from 'react';

export default function TarjetaProducto({ producto, alAgregar }) {
  return (
    <div className="pc">
      <div>
        <span className="b ac">{producto.categoria}</span>
        <h3>{producto.nombre}</h3>
        <p style={{ fontSize: '.85rem', color: 'var(--mu)' }}>{producto.descripcion}</p>
        <div className="pr">${Number(producto.precio).toLocaleString('es-CO')} COP</div>
      </div>
      <button className="bt ac" style={{ marginTop: '12px' }} onClick={() => alAgregar(producto)}>Agregar al Carrito</button>
    </div>
  );
}
