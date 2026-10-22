import React from 'react';

export default function ResumenCarrito({ carrito, vaciarCarrito, actualizarCantidad, eliminarDelCarrito }) {
  const formatearPrecio = (precio) => {
    return new Number(precio).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
  };

  return (
    <div className="cd" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '400px' }}>
      <div>
        <h2 className="t">Resumen del Pedido</h2>

        {carrito.length === 0 ? (
          <p className="mu">El carrito está vacío.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {carrito.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingBottom: '12px', 
                  borderBottom: '1px solid var(--bd)' 
                }}
              >
                <div style={{ flex: 1, paddingRight: '10px' }}>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>{item.nombre}</strong>
                  <span style={{ fontSize: '13px', color: 'var(--ac)', fontWeight: 'bold' }}>
                    {formatearPrecio(item.precio * item.cantidad)} COP
                  </span>
                </div>

                {/* Controles de cantidad */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    className="bt"
                    style={{ padding: '2px 8px', height: '28px' }}
                    onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  >
                    -
                  </button>

                  <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                    {item.cantidad}
                  </span>

                  <button
                    className="bt"
                    style={{ padding: '2px 8px', height: '28px' }}
                    onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  >
                    +
                  </button>

                  <button
                    className="bt er"
                    style={{ padding: '2px 8px', height: '28px', fontSize: '.8rem' }}
                    onClick={() => eliminarDelCarrito(item.id)}
                    title="Eliminar producto"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {carrito.length > 0 && (
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--bd)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.1rem' }}>
            <strong>Total:</strong>
            <strong style={{ color: 'var(--ac)' }}>{formatearPrecio(calcularTotal())} COP</strong>
          </div>

          <button
            className="bt er w"
            onClick={vaciarCarrito}
          >
            VACIAR CARRITO
          </button>
        </div>
      )}
    </div>
  );
}
