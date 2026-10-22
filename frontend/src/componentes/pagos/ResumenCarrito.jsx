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
    return carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '400px'
    }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '20px', textTransform: 'uppercase' }}>
          Resumen del Pedido
        </h2>

        {carrito.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', margin: '40px 0' }}>
            El carrito está vacío. Agrega productos desde el catálogo.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {carrito.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingBottom: '12px', 
                  borderBottom: '1px solid #f1f5f9' 
                }}
              >
                <div style={{ flex: 1, paddingRight: '10px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#1e293b', fontWeight: '700' }}>
                    {item.nombre}
                  </h4>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0284c7' }}>
                    {formatearPrecio(item.precio * item.cantidad)}
                  </span>
                </div>

                {/* Controles para aumentar/disminuir o eliminar producto */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      color: '#334155'
                    }}
                  >
                    -
                  </button>

                  <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                    {item.cantidad}
                  </span>

                  <button
                    onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      color: '#334155'
                    }}
                  >
                    +
                  </button>

                  <button
                    onClick={() => eliminarDelCarrito(item.id)}
                    title="Eliminar producto"
                    style={{
                      marginLeft: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
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
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '2px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#475569' }}>Total:</span>
            <span style={{ fontSize: '20px', fontWeight: '900', color: '#0ea5e9' }}>
              {formatearPrecio(calcularTotal())}
            </span>
          </div>

          <button
            onClick={vaciarCarrito}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#ff0000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '30px',
              fontWeight: '900',
              fontSize: '14px',
              cursor: 'pointer',
              letterSpacing: '0.5px'
            }}
          >
            VACIAR CARRITO
          </button>
        </div>
      )}
    </div>
  );
}
