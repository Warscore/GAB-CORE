import React, { useState } from 'react';

export default function MesaAyuda({ usuario, tickets, alCrearTicket, alActualizarEstado }) {
  const [asunto, setAsunto] = useState('');
  const [categoria, setCategoria] = useState('Hardware');
  const [prioridad, setPrioridad] = useState('Media');
  const [descripcion, setDescripcion] = useState('');

  const enviarTicket = (e) => {
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

  const listaVisible = usuario.rol === 'admin' ? tickets : tickets.filter(t => t.correo === usuario.correo);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
      <div className="cd">
        <h2 className="t">Nuevo Ticket de Soporte</h2>
        <form onSubmit={enviarTicket}>
          <label className="l">Asunto</label>
          <input className="f" value={asunto} onChange={e => setAsunto(e.target.value)} placeholder="Ej. El equipo no enciende" required />

          <span className="l">Categoría</span>
          <div className="seg">
            {['Hardware', 'Software', 'Pagos', 'Mantenimiento'].map(c => (
              <button key={c} type="button" className={categoria === c ? 'on' : ''} onClick={() => setCategoria(c)}>{c}</button>
            ))}
          </div>

          <span className="l">Prioridad</span>
          <div className="seg">
            {['Baja', 'Media', 'Alta'].map(p => (
              <button key={p} type="button" className={prioridad === p ? 'on' : ''} onClick={() => setPrioridad(p)}>{p}</button>
            ))}
          </div>

          <label className="l">Descripción del Inconveniente</label>
          <textarea className="f" rows="4" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Describa detalladamente el problema técnico..." required></textarea>

          <button type="submit" className="bt ac w">Enviar Ticket</button>
        </form>
      </div>

      <div className="cd">
        <h2 className="t">{usuario.rol === 'admin' ? 'Mesa de Ayuda - Panel Administrador' : 'Mis Tickets Registrados'}</h2>
        {listaVisible.length === 0 ? (
          <p className="mu">No hay tickets activos en este momento.</p>
        ) : (
          listaVisible.map(t => (
            <div key={t.id} style={{ padding: '14px', border: '1px solid var(--bd)', borderRadius: '12px', marginBottom: '12px', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                <span>#{t.id} - {t.asunto}</span>
                <span className={`b ${t.prioridad === 'Alta' ? 'er' : 'wa'}`}>{t.prioridad}</span>
              </div>
              <p style={{ fontSize: '.88rem', margin: '8px 0' }}>{t.descripcion}</p>
              <div style={{ fontSize: '.78rem', color: 'var(--mu)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Cliente: {t.cliente} ({t.correo})</span>
                <div>
                  <span className={`b ${t.estado === 'Resuelto' ? 'ok' : 'ac'}`}>{t.estado}</span>
                  {usuario.rol === 'admin' && t.estado !== 'Resuelto' && (
                    <button className="bt ac" style={{ height: '28px', padding: '0 10px', fontSize: '.7rem', marginLeft: '8px' }} onClick={() => alActualizarEstado(t.id)}>Resolver</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
