import React from 'react';
export default function Inicio({ irACatalogo }) {
  return (
    <div className="cd" style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h1 style={{ fontFamily: 'var(--fx)', fontSize: '3rem', margin: '0 0 12px' }}>Bienvenido a <span style={{ color: 'var(--ac)' }}>GAP Core</span></h1>
      <p style={{ maxWidth: '650px', margin: '0 auto 28px', color: 'var(--mu)', fontSize: '1.05rem', fontWeight: 600 }}>
        Plataforma integral para gestión de clientes, catálogo tecnológico avanzado, pasarela de pagos, mesa de ayuda y control técnico de equipos empresariales[cite: 6, 7].
      </p>
      <button className="bt ac" style={{ height: '52px', padding: '0 36px', fontSize: '1rem' }} onClick={irACatalogo}>
        Ver Catálogo de Productos
      </button>
    </div>
  );
}
