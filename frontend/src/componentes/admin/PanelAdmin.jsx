import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import MesaAyuda from '../ayuda/MesaAyuda';
import ControlEquipos from '../equipos/ControlEquipos';

export default function PanelAdmin({ usuario }) {
  const [subTab, setSubTab] = useState('clientes');
  const [clientes, setClientes] = useState([]);
  const [ventasGlobales, setVentasGlobales] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [equiposGlobales, setEquiposGlobales] = useState([]);

  const traer = async (ruta, guardar) => {
    const res = await fetch(`${API_URL}${ruta}`);
    const data = await res.json();
    if (Array.isArray(data)) guardar(data);
  };

  const cargarDatos = async () => {
    try {
      await Promise.all([
        traer('/admin/clientes', setClientes),
        traer('/admin/ordenes', setVentasGlobales),
        traer(`/tickets?cliente_id=${usuario.id}&esAdmin=true`, setTickets),
        traer(`/equipos?cliente_id=${usuario.id}&esAdmin=true`, setEquiposGlobales)
      ]);
    } catch (err) {
      console.error('Error cargando datos de administración:', err);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const resolverTicket = async (id) => {
    await fetch(`${API_URL}/tickets/${id}/resolver`, { method: 'PUT' });
    cargarDatos();
  };

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

      {subTab === 'tickets' && <MesaAyuda tickets={tickets} esAdmin={true} alResolver={resolverTicket} />}

      {subTab === 'equipos' && <ControlEquipos equipos={equiposGlobales} esAdmin={true} />}
    </div>
  );
}
