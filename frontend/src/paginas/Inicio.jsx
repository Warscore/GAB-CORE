import React from 'react';

export default function Inicio({ alIrACatalogo }) {
  return (
    <div className="cd" style={{ textAlign: 'center', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: 'var(--fx)', fontSize: '2.8rem', margin: '0 0 10px' }}>Bienvenido a <span style={{ color: 'var(--ac)' }}>GAP Core</span></h1>
      <p style={{ maxWidth: '600px', margin: '0 auto 24px', color: 'var(--mu)', fontWeight: 600 }}>
        Plataforma integral para gestión de clientes, catálogo tecnológico, pagos en tiempo real, mesa de ayuda corporativa y control de equipos.
      </p>
      <button className="bt ac" style={{ height: '50px', padding: '0 32px', fontSize: '1rem' }} onClick={alIrACatalogo}>
        Explorar Catálogo de Productos
      </button>
    </div>
  );
}
