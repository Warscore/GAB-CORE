import React from 'react';

export default function ControlEquipos({ usuario, equipos }) {
  const equiposVisibles = usuario.rol === 'admin' ? equipos : equipos.filter(e => e.clienteCorreo === usuario.correo);

  return (
    <div className="cd">
      <h2 className="t">{usuario.rol === 'admin' ? 'Control Global de Equipos - Administrador' : 'Mis Equipos Registrados'}</h2>
      <p style={{ color: 'var(--mu)', fontSize: '.9rem', marginBottom: '16px' }}>
        {usuario.rol === 'admin' ? 'Supervisión de series, estados operativos y mantenimientos de todos los clientes corporativos.' : 'Estado técnico y programación de mantenimientos preventivos de sus dispositivos.'}
      </p>
      <div className="kp">
        {['Operativo', 'Vendido', 'Mantenimiento', 'Vencido'].map(est => (
          <div key={est} style={{ '--h': { Operativo: 150, Vendido: 205, Mantenimiento: 38, Vencido: 2 }[est] }}>
            <b>{equiposVisibles.filter(e => e.estado === est).length}</b>{est}
          </div>
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.92rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--bd)', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Serial</th>
              <th style={{ padding: '12px' }}>Equipo</th>
              <th style={{ padding: '12px' }}>Propietario / Cliente</th>
              <th style={{ padding: '12px' }}>Estado</th>
              <th style={{ padding: '12px' }}>Próx. Mantenimiento</th>
              <th style={{ padding: '12px' }}>Fecha de compra</th>
            </tr>
          </thead>
          <tbody>
            {equiposVisibles.length === 0 ? (
           <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center' }} className="mu">No hay equipos registrados para mostrar.</td></tr>
            ) : (
              equiposVisibles.map(eq => (
                <tr key={eq.serial} style={{ borderBottom: '1px solid var(--bd)' }}>
                  <td style={{ padding: '12px', fontWeight: 800 }}>{eq.serial}</td>
                  <td style={{ padding: '12px' }}>{eq.nombre}</td>
                  <td style={{ padding: '12px' }}>{eq.clienteCorreo}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`b ${eq.estado === 'Operativo' ? 'ok' : 'wa'}`}>{eq.estado}</span>
                  </td>
                  <td style={{ padding: '12px' }}>{eq.proxMantenimiento}</td>
                  <td style={{ padding: '12px' }}>{eq.fechaCompra || '—'}</td>
                </tr>
              ))
            )}
            const COLOR_ESTADO = { Operativo: 'ok', Vendido: 'ac', Mantenimiento: 'wa', Vencido: 'er' };
          </tbody>
        </table>
      </div>
    </div>
  );
}
