import React from 'react';

export default function ResumenCarrito({ carrito, alModificarCantidad, alQuitarItem, alVaciarCarrito }) {
  return (
    <div className="cd">
      <h2 className="t">Resumen del Pedido</h2>
      {carrito.length === 0 ? <p className="mu">El carrito está vacío.</p> : carrito.map(i => (
        <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--bd)' }}>
          <div>
            <strong>{i.nombre}</strong>
            <div className="mu">${Number(i.precio).toLocaleString('es-CO')} c/u</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="bt" style={{ padding: '2px 8px', height: '28px' }} onClick={() => alModificarCantidad(i.id, i.cantidad - 1)}>-</button>
            <span style={{ fontWeight: 'bold' }}>{i.cantidad}</span>
            <button className="bt" style={{ padding: '2px 8px', height: '28px' }} onClick={() => alModificarCantidad(i.id, i.cantidad + 1)}>+</button>
            <button className="bt er" style={{ padding: '2px 8px', height: '28px', fontSize: '.8rem' }} onClick={() => alQuitarItem(i.id)}>✕</button>
          </div>
        </div>
      ))}
      {carrito.length > 0 && (
        <button className="bt er w" style={{ marginTop: '16px' }} onClick={alVaciarCarrito}>Vaciar Carrito</button>
      )}
    </div>
  );
}
