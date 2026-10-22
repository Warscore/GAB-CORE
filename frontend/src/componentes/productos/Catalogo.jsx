import React, { useState } from 'react';

export default function Catalogo({ productos, alAgregar, terminoBusq }) {
  const [categoria, setCategoria] = useState('Todas');
  const [fichaActiva, setFichaActiva] = useState(null);

  const filtrados = productos.filter(p => {
    const matchCat = categoria === 'Todas' || (categoria === 'Ofertas' ? p.enOferta : p.categoria === categoria);
    const matchText = p.nombre.toLowerCase().includes(terminoBusq.toLowerCase()) || p.categoria.toLowerCase().includes(terminoBusq.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <div>
      <div className="seg">
        {['Todas', 'Ofertas', 'Computadores', 'Redes', 'Impresoras', 'Gaming', 'Accesorios'].map(cat => (
          <button key={cat} className={categoria === cat ? 'on' : ''} onClick={() => setCategoria(cat)}>{cat}</button>
        ))}
      </div>

      <div className="gd">
        {filtrados.length === 0 ? (
          <p className="mu">No hay productos disponibles para esta búsqueda:</p>
        ) : (
          filtrados.map(p => (
            <div key={p.id} className="pc">
              <div>
                <span className="b ac" style={{ fontSize: '.7rem' }}>{p.categoria}</span>
                {p.enOferta && <span className="b er" style={{ marginLeft: '6px', fontSize: '.7rem' }}>Oferta</span>}
                <h3>{p.nombre}</h3>
                <p style={{ fontSize: '.85rem', color: 'var(--mu)' }}>{p.resumen}</p>
                <div className="pr">${p.precio.toLocaleString('es-CO')} COP</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                <button className="bt ac" onClick={() => alAgregar(p)}>Agregar al Carrito</button>
                <button className="bt" style={{ background: 'transparent', color: 'var(--tx)', border: '1px solid var(--bd)' }} onClick={() => setFichaActiva(fichaActiva === p.id ? null : p.id)}>
                  {fichaActiva === p.id ? 'Ocultar Ficha' : 'Ficha Técnica'}
                </button>
              </div>

              {fichaActiva === p.id && (
                <div style={{ marginTop: '10px', padding: '10px', background: 'var(--bg)', borderRadius: '10px', fontSize: '.8rem' }}>
                  <strong>Detalles técnicos:</strong>
                  <p style={{ margin: '4px 0 0' }}>{p.especificaciones}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
