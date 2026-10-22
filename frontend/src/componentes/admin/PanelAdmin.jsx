import React, { useState } from 'react';

export default function PanelAdmin({ clientes, ventasGlobales, tickets, alResolverTicket, equiposGlobales }) {
  const [subPestana, setSubPestana] = useState('clientes');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  return (
    <div className="cd">
      <div style={{ borderBottom: '1px solid var(--bd)', paddingBottom: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="t" style={{ margin: 0 }}>👑 PANEL DE ADMINISTRACIÓN CENTRAL</h2>
          <small className="mu">Consola corporativa de control de clientes, auditoría de ventas y soporte técnico</small>
        </div>
      </div>

      <div className="seg" style={{ marginBottom: '24px' }}>
        <button className={subPestana === 'clientes' ? 'on' : ''} onClick={() => setSubPestana('clientes')}>👥 Clientes Registrados ({clientes.filter(c => c.rol !== 'admin').length})</button>
        <button className={subPestana === 'ventas' ? 'on' : ''} onClick={() => setSubPestana('ventas')}>📊 Historial Global de Ventas ({ventasGlobales.length})</button>
        <button className={subPestana === 'tickets' ? 'on' : ''} onClick={() => setSubPestana('tickets')}>🎫 Mesa de Ayuda / PQRS ({tickets.length})</button>
        <button className={subPestana === 'equipos' ? 'on' : ''} onClick={() => setSubPestana('equipos')}>💻 Dispositivos por Cliente ({equiposGlobales.length})</button>
      </div>

 
      {subPestana === 'clientes' && (
        <div>
          <h3 style={{ fontFamily: 'var(--fx)', textTransform: 'uppercase' }}>Directorio de Clientes</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--bd)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Tipo / N° Doc</th>
                  <th style={{ padding: '10px' }}>Cliente</th>
                  <th style={{ padding: '10px' }}>Correo Electrónico</th>
                  <th style={{ padding: '10px' }}>Teléfono</th>
                  <th style={{ padding: '10px' }}>Ciudad</th>
                  <th style={{ padding: '10px' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {clientes.filter(c => c.rol !== 'admin').map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--bd)' }}>
                    <td style={{ padding: '10px', fontWeight: 700 }}>{c.docTipo || 'CC'} {c.docNum || '1020304050'}</td>
                    <td style={{ padding: '10px' }}>{c.nombre}</td>
                    <td style={{ padding: '10px' }}>{c.correo}</td>
                    <td style={{ padding: '10px' }}>{c.telefono || '3001234567'}</td>
                    <td style={{ padding: '10px' }}>{c.ciudad || 'Soacha'}</td>
                    <td style={{ padding: '10px' }}>
                      <button className="bt ac" style={{ height: '30px', fontSize: '.72rem', padding: '0 12px' }} onClick={() => { setClienteSeleccionado(c.correo); setSubPestana('equipos'); }}>
                        Ver Equipos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

     
      {subPestana === 'ventas' && (
        <div>
          <h3 style={{ fontFamily: 'var(--fx)', textTransform: 'uppercase' }}>Consolidado Total de Compras</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--bd)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>ID Orden</th>
                  <th style={{ padding: '10px' }}>Cliente</th>
                  <th style={{ padding: '10px' }}>Detalle de Productos</th>
                  <th style={{ padding: '10px' }}>Medio de Pago</th>
                  <th style={{ padding: '10px' }}>Total Pagado</th>
                  <th style={{ padding: '10px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ventasGlobales.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }} className="mu">Aún no se han registrado compras en la plataforma.</td></tr>
                ) : (
                  ventasGlobales.map((v) => (
                    <tr key={v.id} style={{ borderBottom: '1px solid var(--bd)' }}>
                      <td style={{ padding: '10px', fontWeight: 800 }}>#{v.id}</td>
                      <td style={{ padding: '10px' }}>{v.clienteNombre} <br/><small className="mu">{v.clienteCorreo}</small></td>
                      <td style={{ padding: '10px' }}>{v.items.map(it => `${it.nombre} (x${it.cantidad})`).join(', ')}</td>
                      <td style={{ padding: '10px' }}>{v.medioPago}</td>
                      <td style={{ padding: '10px', fontWeight: 800, color: 'var(--ac)' }}>${v.total.toLocaleString('es-CO')} COP</td>
                      <td style={{ padding: '10px' }}><span className="b ok">Aprobado</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

   
      {subPestana === 'tickets' && (
        <div>
          <h3 style={{ fontFamily: 'var(--fx)', textTransform: 'uppercase' }}>Solicitudes y PQRS de Clientes</h3>
          {tickets.length === 0 ? (
            <p className="mu">No hay tickets pendientes.</p>
          ) : (
            tickets.map(t => (
              <div key={t.id} style={{ padding: '14px', border: '1px solid var(--bd)', borderRadius: '12px', marginBottom: '12px', background: 'var(--bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '1rem' }}>#{t.id} - {t.asunto}</strong>
                  <span className={`b ${t.prioridad === 'Alta' ? 'er' : 'wa'}`}>{t.prioridad}</span>
                </div>
                <p style={{ fontSize: '.88rem', margin: '8px 0' }}>{t.descripcion}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.8rem', color: 'var(--mu)' }}>
                  <span>Cliente: <b>{t.cliente}</b> ({t.correo})</span>
                  <div>
                    <span className={`b ${t.estado === 'Resuelto' ? 'ok' : 'ac'}`} style={{ marginRight: '8px' }}>{t.estado}</span>
                    {t.estado !== 'Resuelto' && (
                      <button className="bt ac" style={{ height: '28px', fontSize: '.72rem', padding: '0 12px' }} onClick={() => alResolverTicket(t.id)}>Marcar como Resuelto</button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}


      {subPestana === 'equipos' && (
        <div>
          <h3 style={{ fontFamily: 'var(--fx)', textTransform: 'uppercase' }}>
            Estado Técnico de Dispositivos por Cliente {clienteSeleccionado && `(Filtrado: ${clienteSeleccionado})`}
          </h3>
          {clienteSeleccionado && (
            <button className="bt" style={{ height: '28px', fontSize: '.75rem', marginBottom: '14px' }} onClick={() => setClienteSeleccionado(null)}>
              Mostrar Todos los Clientes
            </button>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--bd)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Serial</th>
                  <th style={{ padding: '10px' }}>Equipo</th>
                  <th style={{ padding: '10px' }}>Propietario / Cliente</th>
                  <th style={{ padding: '10px' }}>Estado Actual</th>
                  <th style={{ padding: '10px' }}>Diagnóstico / Mantenimiento</th>
                </tr>
              </thead>
              <tbody>
                {equiposGlobales
                  .filter(e => !clienteSeleccionado || e.clienteCorreo === clienteSeleccionado)
                  .map((e, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--bd)' }}>
                      <td style={{ padding: '10px', fontWeight: 800 }}>{e.serial}</td>
                      <td style={{ padding: '10px' }}>{e.nombre}</td>
                      <td style={{ padding: '10px' }}>{e.clienteCorreo}</td>
                      <td style={{ padding: '10px' }}>
                        <span className={`b ${e.estado === 'Operativo' ? 'ok' : 'er'}`}>
                          {e.estado === 'Operativo' ? '🟢 En Funcionamiento' : '🔴 Dañado / Fuera de Servicio'}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>{e.diagnostico || e.proxMantenimiento}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
