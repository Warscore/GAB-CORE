import React, { useState } from 'react';

export default function MesaAyuda({ usuario, tickets, alCrearTicket }) {
  const [asunto, setAsunto] = useState('');
  const [categoria, setCategoria] = useState('Hardware');
  const [prioridad, setPrioridad] = useState('Media');
  const [descripcion, setDescripcion] = useState('');

  const enviar = (e) => {
    e.preventDefault();
    if (!asunto || !descripcion) return;
    alCrearTicket({
      asunto,
      categoria,
      prioridad,
      descripcion,
      cliente: usuario.nombre,
      correo: usuario.correo
    });
    setAsunto('');
    setDescripcion('');
  };

  const misTickets = tickets.filter(t => usuario.rol === 'admin' || t.correo === usuario.correo);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
      <div className="cd">
        <h2 className="t">Nuevo Ticket de Soporte</h2>
        <form onSubmit={enviar}>
          <label className="l">Asunto del Problema</label>
          <input className="f" value={asunto} onChange={e => setAsunto(e.target.value)} placeholder="Ej. Impresora no conecta a la red" required />

          <span className="l">Categoría</span>
          <div className="seg">
            {['Hardware', 'Software', 'Pagos', 'Mantenimiento'].map(cat => (
              <button key={cat} type="button" className={categoria === cat ? 'on' : ''} onClick={() => setCategoria(cat)}>{cat}</button>
            ))}
          </div>

          <span className="l">Prioridad</span>
          <div className="seg">
            {['Baja', 'Media', 'Alta'].map(prio => (
              <button key={prio} type="button" className={prioridad === prio ? 'on' : ''} onClick={() => setPrioridad(prio)}>{prio}</button>
            ))}
          </div>

          <label className="l">Descripción Detallada</label>
          <textarea className="f" rows="4" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Explica la falla..." required></textarea>

          <button type="submit" className="bt ac w">Enviar Ticket</button>
        </form>
      </div>

      <div className="cd">
        <h2 className="t">{usuario.rol === 'admin' ? 'Todos los Tickets (Panel Admin)' : 'Mis Tickets Recientes'}</h2>
        {misTickets.length === 0 ? (
          <p className="mu">No hay tickets registrados.</p>
        ) : (
          misTickets.map(t => (
            <div key={t.id} style={{ padding: '12px', border: '1px solid var(--bd)', borderRadius: '10px', marginBottom: '10px', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>#{t.id} - {t.asunto}</span>
                <span className={`b ${t.prioridad === 'Alta' ? 'er' : 'wa'}`}>{t.prioridad}</span>
              </div>
              <p style={{ fontSize: '.85rem', margin: '6px 0' }}>{t.descripcion}</p>
              <div style={{ fontSize: '.75rem', color: 'var(--mu)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Cliente: {t.cliente}</span>
                <span className="b ok">{t.estado}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
