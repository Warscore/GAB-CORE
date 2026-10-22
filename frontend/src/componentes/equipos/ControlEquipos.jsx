import React from 'react';

const ESTADOS_EQUIPO = ['Operativo', 'Vendido', 'Mantenimiento', 'Vencido', 'Dañado'];
const CLASE_POR_ESTADO = {
  Operativo: 'ok',
  Vendido: 'ac',
  Mantenimiento: 'wa',
  Vencido: 'er',
  Dañado: 'er',
};

export default function ControlEquipos({ usuario, equipos = [] }) {
  const esAdmin = usuario?.rol === 'admin';
  const correoUsuario = usuario?.correo;

  const equiposVisibles = esAdmin
    ? equipos
    : equipos.filter((equipo) =>
        (equipo.cliente_correo || equipo.clienteCorreo || equipo.correo) === correoUsuario
      );

  const obtenerNombre = (equipo) => equipo.nombre_equipo || equipo.nombre || 'Equipo';
  const obtenerMantenimiento = (equipo) =>
    equipo.proximo_mantenimiento || equipo.proxMantenimiento || 'Sin programar';
  const obtenerCorreo = (equipo) => equipo.cliente_correo || equipo.clienteCorreo || equipo.correo || '—';

  return (
    <section className="cd">
      <h2 className="t">{esAdmin ? 'Control Global de Equipos' : 'Mis Equipos Registrados'}</h2>
      <p className="equipos-intro">
        {esAdmin
          ? 'Supervisión de seriales, estados operativos y mantenimientos de los equipos registrados.'
          : 'Consulta el estado técnico y el mantenimiento preventivo de tus dispositivos.'}
      </p>

      <div className="equipos-resumen">
        {ESTADOS_EQUIPO.map((estado) => (
          <div className="equipo-indicador" key={estado}>
            <strong>{equiposVisibles.filter((equipo) => equipo.estado === estado).length}</strong>
            <span>{estado}</span>
          </div>
        ))}
      </div>

      <div className="equipos-tabla-contenedor">
        <table className="tabla-equipos">
          <thead>
            <tr>
              <th>Serial</th>
              <th>Equipo</th>
              {esAdmin && <th>Propietario / Cliente</th>}
              <th>Estado</th>
              <th>Próximo mantenimiento</th>
            </tr>
          </thead>
          <tbody>
            {equiposVisibles.length === 0 ? (
              <tr>
                <td colSpan={esAdmin ? 5 : 4} className="tabla-vacia">
                  No hay equipos registrados para mostrar.
                </td>
              </tr>
            ) : (
              equiposVisibles.map((equipo) => (
                <tr key={equipo.id ?? equipo.serial}>
                  <td className="equipo-serial">{equipo.serial || '—'}</td>
                  <td>{obtenerNombre(equipo)}</td>
                  {esAdmin && <td>{obtenerCorreo(equipo)}</td>}
                  <td>
                    <span className={`b ${CLASE_POR_ESTADO[equipo.estado] || 'wa'}`}>
                      {equipo.estado || 'Sin estado'}
                    </span>
                  </td>
                  <td>{obtenerMantenimiento(equipo)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
