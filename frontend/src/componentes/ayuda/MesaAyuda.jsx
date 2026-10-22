import React from 'react';

// Lista de tickets. El cliente ve los suyos; el administrador ve todos y puede resolverlos.
export default function MesaAyuda({ tickets, esAdmin, alResolver }) {
  return (
    <div className={esAdmin ? '' : 'cd'}>
      {!esAdmin && <h2 className="t">Mis Tickets Registrados</h2>}
      {tickets.map(t => (
        <div key={t.id} style={{ padding: '12px', background: esAdmin ? 'var(--bg)' : undefined, border: '1px solid var(--bd)', borderRadius: '10px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
            <span>{esAdmin ? `#${t.id} - ${t.asunto} (${t.cliente})` : t.asunto}</span>
            <span className={`b ${t.estado === 'Resuelto' ? 'ok' : 'ac'}`}>{t.estado}</span>
          </div>
          <p style={{ margin: '6px 0', fontSize: '.9rem' }}>{t.descripcion}</p>
          {esAdmin && t.estado !== 'Resuelto' && (
            <button className="bt ac" style={{ height: '26px', fontSize: '.7rem' }} onClick={() => alResolver(t.id)}>Marcar Resuelto</button>
          )}
        </div>
      ))}
    </div>
  );
}
