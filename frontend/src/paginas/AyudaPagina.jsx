import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import FormularioAyuda from '../componentes/ayuda/FormularioAyuda';
import MesaAyuda from '../componentes/ayuda/MesaAyuda';

export default function AyudaPagina({ usuario }) {
  const [tickets, setTickets] = useState([]);

  const cargarTickets = () => {
    fetch(`${API_URL}/tickets?cliente_id=${usuario.id}&esAdmin=false`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setTickets(data); })
      .catch(err => console.error('Error cargando tickets:', err));
  };

  useEffect(() => { cargarTickets(); }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '20px' }}>
      <FormularioAyuda usuario={usuario} alCrear={cargarTickets} />
      <MesaAyuda tickets={tickets} esAdmin={false} />
    </div>
  );
}
