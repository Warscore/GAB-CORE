import React, { useState } from 'react';
import { API_URL } from '../../config';

export default function FormularioLogin({ alIniciarSesion }) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [errorAuth, setErrorAuth] = useState('');

  const manejarLogin = async (e) => {
    e.preventDefault();
    setErrorAuth('');
    try {
      const res = await fetch(`${API_URL}/clientes/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: loginEmail, contrasena: loginPass })
      });
      const data = await res.json();
      if (res.ok) {
        alIniciarSesion(data);
      } else {
        setErrorAuth(data.error || 'Credenciales incorrectas.');
      }
    } catch (err) {
      setErrorAuth('No se pudo conectar con el servidor.');
    }
  };

  return (
    <form onSubmit={manejarLogin}>
      {errorAuth && <p className="er" style={{ fontWeight: 700, textAlign: 'center' }}>{errorAuth}</p>}
      <label className="l">Correo Electrónico</label>
      <input className="f" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="admin@gapcore.com" required />
      <label className="l">Contraseña</label>
      <input className="f" type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Contraseña" required />
      <button type="submit" className="bt ac w">Ingresar</button>
      <small className="mu" style={{ display: 'block', textAlign: 'center', marginTop: '12px' }}>Admin por defecto: admin@gapcore.com / Admin123</small>
    </form>
  );
}
