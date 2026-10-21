import React from 'react';
import FormularioRegistro from '../componentes/clientes/FormularioRegistro';

export default function ClientesPagina({ alRegistrar, irALogin }) {
  return <FormularioRegistro alRegistrar={alRegistrar} irALogin={irALogin} />;
}
