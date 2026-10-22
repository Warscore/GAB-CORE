import React from 'react';

// Tabla de equipos. El cliente ve los suyos; el administrador ve todos con su propietario.
export default function ControlEquipos({ equipos, esAdmin }) {
  return (
    <div className={esAdmin ? '' : 'cd'}>
      {!esAdmin && <h2 className="t">Mis Dispositivos en Funcionamiento</h2>}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--bd)', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Serial</th>
              <th style={{ padding: '10px' }}>Equipo</th>
              {esAdmin && <th style={{ padding: '10px' }}>Propietario</th>}
              <th style={{ padding: '10px' }}>Estado</th>
              {!esAdmin && <th style={{ padding: '10px' }}>Mantenimiento</th>}
            </tr>
          </thead>
          <tbody>
            {equipos.map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid var(--bd)' }}>
                <td style={{ padding: '10px', fontWeight: 800 }}>{e.serial}</td>
                <td style={{ padding: '10px' }}>{e.nombre_equipo}</td>
                {esAdmin && <td style={{ padding: '10px' }}>{e.cliente_correo}</td>}
                <td style={{ padding: '10px' }}><span className="b ok">{e.estado}</span></td>
                {!esAdmin && <td style={{ padding: '10px' }}>{e.proximo_mantenimiento}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
