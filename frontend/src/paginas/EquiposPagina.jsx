import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import ControlEquipos from '../componentes/equipos/ControlEquipos';

export default function EquiposPagina({ usuario }) {
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/equipos?cliente_id=${usuario.id}&esAdmin=false`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setEquipos(data); })
      .catch(err => console.error('Error cargando equipos:', err));
  }, []);

  return <ControlEquipos equipos={equipos} esAdmin={false} />;
}
