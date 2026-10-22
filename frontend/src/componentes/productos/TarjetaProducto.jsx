import React from 'react';

export default function TarjetaProducto({ producto, agregarAlCarrito }) {

  const formatearPrecio = (precio) => {
    return new Number(precio).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  };

  return (
    <div style={{
      backgroundColor: '#111a24',
      border: '1px solid #1f2937',
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.4)',
      color: '#fff',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}>
      <div>
        <span style={{
          display: 'inline-block',
          fontSize: '11px',
          padding: '4px 10px',
          borderRadius: '20px',
          backgroundColor: '#0ea5e9',
          color: '#fff',
          marginBottom: '12px',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          {producto.categoria}
        </span>
        <h3 style={{ fontSize: '18px', margin: '0 0 10px 0', color: '#fff', fontWeight: '600' }}>
          {producto.nombre}
        </h3>
        <p style={{ fontSize: '14px', color: '#9ca3af', margin: '0 0 20px 0', lineHeight: '1.5' }}>
          {producto.descripcion}
        </p>
      </div>

      <div>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '16px' }}>
          {formatearPrecio(producto.precio)}
        </div>
        <button
          onClick={() => agregarAlCarrito(producto)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            letterSpacing: '0.5px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0369a1'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#0284c7'}
        >
          AGREGAR AL CARRITO
        </button>
      </div>
    </div>
  );
}
