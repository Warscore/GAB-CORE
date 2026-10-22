import React, { useState } from 'react';

export default function PanelAdmin({ clientes, ventasGlobales, tickets, alResolverTicket, equiposGlobales }) {
  const [subTab, setSubTab] = useState('clientes');

  return (
    <div className="cd">
      <h2 className="t">Panel de Administración General</h2>
      
      <div className="seg" style={{ margin: '16px 0' }}>
        <button className={subTab === 'clientes' ? 'on' : ''} onClick={() => setSubTab('clientes')}>👥 Clientes Registrados ({clientes.length})</button>
        <button className={subTab === 'ventas' ? 'on' : ''} onClick={() => setSubTab('ventas')}>📊 Historial Global Ventas ({ventasGlobales.length})</button>
        <button className={subTab === 'tickets' ? 'on' : ''} onClick={() => setSubTab('tickets')}>🎫 Mesa de Ayuda ({tickets.length})</button>
        <button className={subTab === 'equipos' ? 'on' : ''} onClick={() => setSubTab('equipos')}>💻 Dispositivos Clientes ({equiposGlobales.length})</button>
      </div>

      {subTab === 'clientes' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bd)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Documento</th>
                <th style={{ padding: '10px' }}>Nombre</th>
                <th style={{ padding: '10px' }}>Correo</th>
                <th style={{ padding: '10px' }}>Ciudad / Tel</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--bd)' }}>
                  <td style={{ padding: '10px' }}>{c.tipo_documento} {c.numero_documento}</td>
                  <td style={{ padding: '10px', fontWeight: 800 }}>{c.nombre_razon_social}</td>
                  <td style={{ padding: '10px' }}>{c.correo}</td>
                  <td style={{ padding: '10px' }}>{c.ciudad} ({c.telefono})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {subTab === 'ventas' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bd)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Orden</th>
                <th style={{ padding: '10px' }}>Cliente</th>
                <th style={{ padding: '10px' }}>Medio de Pago</th>
                <th style={{ padding: '10px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {ventasGlobales.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--bd)' }}>
                  <td style={{ padding: '10px', fontWeight: 800 }}>#{v.id}</td>
                  <td style={{ padding: '10px' }}>{v.nombre_razon_social} <br/><small className="mu">{v.correo}</small></td>
                  <td style={{ padding: '10px' }}>{v.medio_pago}</td>
                  <td style={{ padding: '10px', color: 'var(--ac)', fontWeight: 800 }}>${Number(v.total).toLocaleString('es-CO')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {subTab === 'tickets' && (
        <div>
          {tickets.map(t => (
            <div key={t.id} style={{ padding: '12px', background: 'var(--bg)', borderRadius: '10px', marginBottom: '10px', border: '1px solid var(--bd)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                <span>#{t.id} - {t.asunto} ({t.cliente})</span>
                <span className={`b ${t.estado === 'Resuelto' ? 'ok' : 'ac'}`}>{t.estado}</span>
              </div>
              <p style={{ margin: '6px 0', fontSize: '.9rem' }}>{t.descripcion}</p>
              {t.estado !== 'Resuelto' && (
                <button className="bt ac" style={{ height: '26px', fontSize: '.7rem' }} onClick={() => alResolverTicket(t.id)}>Marcar Resuelto</button>
              )}
            </div>
          ))}
        </div>
      )}

      {subTab === 'equipos' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bd)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Serial</th>
                <th style={{ padding: '10px' }}>Equipo</th>
                <th style={{ padding: '10px' }}>Propietario</th>
                <th style={{ padding: '10px' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {equiposGlobales.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--bd)' }}>
                  <td style={{ padding: '10px', fontWeight: 800 }}>{e.serial}</td>
                  <td style={{ padding: '10px' }}>{e.nombre_equipo}</td>
                  <td style={{ padding: '10px' }}>{e.cliente_correo}</td>
                  <td style={{ padding: '10px' }}><span className="b ok">{e.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
