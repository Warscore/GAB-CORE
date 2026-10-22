import React, { useState } from 'react';
import FormularioLogin from '../componentes/clientes/FormularioLogin';
import FormularioRegistro from '../componentes/clientes/FormularioRegistro';

// Pantalla de acceso: iniciar sesión o registrarse.
export default function ClientesPagina({ alIniciarSesion, temaOscuro, alCambiarTema }) {
  const [vistaAuth, setVistaAuth] = useState('login');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg)', padding: '20px' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button className="bt" style={{ background: 'transparent', color: 'var(--tx)', border: '1px solid var(--bd)' }} onClick={alCambiarTema}>
          {temaOscuro ? '🌙 Oscuro' : '☀️ Claro'}
        </button>
      </div>

      <div className="cd" style={{ maxWidth: '480px', width: '100%', padding: '30px' }}>
        <h1 className="logo" style={{ textAlign: 'center', color: 'var(--ac)', fontSize: '2.5rem' }}><b>G</b>AP<small>.core</small></h1>

        <div className="seg" style={{ justifyContent: 'center', margin: '20px 0' }}>
          <button className={vistaAuth === 'login' ? 'on' : ''} onClick={() => setVistaAuth('login')}>Iniciar Sesión</button>
          <button className={vistaAuth === 'registro' ? 'on' : ''} onClick={() => setVistaAuth('registro')}>Registrarse</button>
        </div>

        {vistaAuth === 'login'
          ? <FormularioLogin alIniciarSesion={alIniciarSesion} />
          : <FormularioRegistro irALogin={() => setVistaAuth('login')} />}
      </div>
    </div>
  );
}
