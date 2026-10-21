import React from 'react';
import MesaAyuda from '../componentes/ayuda/MesaAyuda';
export default function AyudaPagina({ usuario, tickets, alCrearTicket, alActualizarEstado }) {
  return <MesaAyuda usuario={usuario} tickets={tickets} alCrearTicket={alCrearTicket} alActualizarEstado={alActualizarEstado} />;
}
