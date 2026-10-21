import React from 'react';

export default function ControlEquipos({ usuario, equipos }) {
  const misEquipos = equipos.filter(e => usuario.rol === 'admin' || e.clienteCorreo === usuario.correo);

  return (
    <div className="cd">
      <h2 className="t">{usuario.rol === 'admin' ? 'Inventario General de Equipos (Admin)' : 'Mis Equipos Registrados'}</h2>
      <p style={{ color: 'var(--mu)', fontSize: '.88rem' }}>
        {usuario.rol === 'admin' ? 'Módulo corporativo para seguimiento de mantenimientos preventivos y garantías.' : 'Visualiza el estado técnico de los equipos asignados a tu cuenta.'}
      </p>

      <div style={{ overflowX: 'auto', marginTop: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--bd)', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Serial</th>
              <th style={{ padding: '10px' }}>Equipo</th>
              <th style={{ padding: '10px' }}>Cliente</th>
              <th style={{ padding: '10px' }}>Estado</th>
              <th style={{ padding: '10px' }}>Próx. Mantenimiento</th>
            </tr>
          </thead>
          <tbody>
            {misEquipos.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '16px', textAlign: 'center' }} className="mu">No tienes equipos registrados.</td></tr>
            ) : (
              misEquipos.map(eq => (
                <tr key={eq.serial} style={{ borderBottom: '1px solid var(--bd)' }}>
                  <td style={{ padding: '10px', fontWeight: 700 }}>{eq.serial}</td>
                  <td style={{ padding: '10px' }}>{eq.nombre}</td>
                  <td style={{ padding: '10px' }}>{eq.clienteCorreo}</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`b ${eq.estado === 'Operativo' ? 'ok' : 'wa'}`}>{eq.estado}</span>
                  </td>
                  <td style={{ padding: '10px' }}>{eq.proxMantenimiento}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
