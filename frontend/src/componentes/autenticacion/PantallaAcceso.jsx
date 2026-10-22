import React, { useState } from 'react';
import FormularioRegistro from '../clientes/FormularioRegistro';

export default function PantallaAcceso({
  temaOscuro,
  alCambiarTema,
  alIniciarSesion,
  alRegistrarCliente,
  errorAuth,
  autenticando,
}) {
  const [vistaAuth, setVistaAuth] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const manejarEnvioLogin = async (evento) => {
    evento.preventDefault();
    const inicioCorrecto = await alIniciarSesion({
      correo: loginEmail.trim(),
      contrasena: loginPass,
    });

    if (inicioCorrecto) setLoginPass('');
  };

  const manejarRegistro = async (nuevoCliente) => {
    const registroCorrecto = await alRegistrarCliente(nuevoCliente);
    if (registroCorrecto) {
      setLoginEmail(nuevoCliente.correo);
      setLoginPass('');
      setVistaAuth('login');
    }
  };

  return (
    <div className="pantalla-acceso">
      <div className="acceso-tema">
        <button
          type="button"
          className="bt"
          style={{ background: 'transparent', color: 'var(--tx)', border: '1px solid var(--bd)' }}
          onClick={alCambiarTema}
        >
          {temaOscuro ? '🌙 Oscuro' : '☀️ Claro'}
        </button>
      </div>

      <section className="cd tarjeta-acceso">
        <h1 className="logo logo-acceso"><b>G</b>AP<small>.core</small></h1>

        <div className="seg acceso-pestanas">
          <button
            type="button"
            className={vistaAuth === 'login' ? 'on' : ''}
            onClick={() => setVistaAuth('login')}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={vistaAuth === 'registro' ? 'on' : ''}
            onClick={() => setVistaAuth('registro')}
          >
            Registrarse
          </button>
        </div>

        {vistaAuth === 'login' ? (
          <form onSubmit={manejarEnvioLogin}>
            {errorAuth && <p className="er mensaje-auth" role="alert">{errorAuth}</p>}

            <label className="l" htmlFor="login-correo">Correo Electrónico</label>
            <input
              id="login-correo"
              className="f"
              type="email"
              autoComplete="username"
              value={loginEmail}
              onChange={(evento) => setLoginEmail(evento.target.value)}
              placeholder="admin@gapcore.com"
              required
            />

            <label className="l" htmlFor="login-contrasena">Contraseña</label>
            <input
              id="login-contrasena"
              className="f"
              type="password"
              autoComplete="current-password"
              value={loginPass}
              onChange={(evento) => setLoginPass(evento.target.value)}
              placeholder="Contraseña"
              required
            />

            <button type="submit" className="bt ac w" disabled={autenticando}>
              {autenticando ? 'Validando...' : 'Ingresar'}
            </button>
            <small className="mu nota-admin">
              Admin de instalación: admin@gapcore.com / Admin123
            </small>
          </form>
        ) : (
          <FormularioRegistro
            alRegistrar={manejarRegistro}
            irALogin={() => setVistaAuth('login')}
          />
        )}
      </section>
    </div>
  );
}
