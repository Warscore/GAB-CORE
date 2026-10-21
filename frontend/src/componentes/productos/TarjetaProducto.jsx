import React, { useState } from 'react';

export default function TarjetaProducto({ producto, alAgregar }) {
  const [verDetalle, setVerDetalle] = useState(false);

  return (
    <div className="pc">
      <div>
        <span className="b ac" style={{ fontSize: '.68rem' }}>{producto.categoria}</span>
        {producto.enOferta && <span className="b er" style={{ marginLeft: '6px', fontSize: '.68rem' }}>Oferta</span>}
        <h3>{producto.nombre}</h3>
        <p style={{ fontSize: '.82rem', color: 'var(--mu)' }}>{producto.resumen}</p>
        <div className="pr">${producto.precio.toLocaleString('es-CO')} COP</div>
      </div>
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button className="bt ac" style={{ width: '100%' }} onClick={() => alAgregar(producto)}>
          + Agregar al Pedido
        </button>
        <button className="bt" style={{ width: '100%', background: 'transparent', color: 'var(--tx)', border: '1px solid var(--bd)' }} onClick={() => setVerDetalle(!verDetalle)}>
          {verDetalle ? 'Ocultar Ficha' : 'Ficha Técnica'}
        </button>
      </div>

      {verDetalle && (
        <div style={{ marginTop: '10px', padding: '10px', background: 'var(--bg)', borderRadius: '8px', fontSize: '.78rem' }}>
          <strong>Especificaciones:</strong>
          <p style={{ margin: '4px 0' }}>{producto.especificaciones}</p>
        </div>
      )}
    </div>
  );
}
