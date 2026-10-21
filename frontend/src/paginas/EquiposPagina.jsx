import React from 'react';
import ControlEquipos from '../componentes/equipos/ControlEquipos';
export default function EquiposPagina({ usuario, equipos }) {
  return <ControlEquipos usuario={usuario} equipos={equipos} />;
}
