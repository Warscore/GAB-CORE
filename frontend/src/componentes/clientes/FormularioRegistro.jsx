import React, { useState } from 'react';

export default function FormularioRegistro({ alRegistrar, irALogin }) {
  const [docTipo, setDocTipo] = useState('CC');
  const [docNum, setDocNum] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (!docNum || !nombre || !correo || !pass) {
      setMsg('Por favor completa los campos obligatorios.');
      return;
    }
    const nuevoUsuario = {
      nombre,
      correo: correo.toLowerCase(),
      docNum,
      docTipo,
      telefono,
      ciudad,
      rol: 'cliente'
    };
    alRegistrar(nuevoUsuario);
  };

  return (
    <div className="cd" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="t">Crear Cuenta de Cliente</h2>
      {msg && <p className="er" style={{ fontWeight: 700 }}>{msg}</p>}
      <form onSubmit={manejarSubmit}>
        <span className="l">Tipo de Documento</span>
        <div className="seg">
          <button type="button" className={docTipo === 'CC' ? 'on' : ''} onClick={() => setDocTipo('CC')}>Cédula de Ciudadanía</button>
          <button type="button" className={docTipo === 'NIT' ? 'on' : ''} onClick={() => setDocTipo('NIT')}>NIT</button>
          <button type="button" className={docTipo === 'CE' ? 'on' : ''} onClick={() => setDocTipo('CE')}>Cédula Extranjería</button>
        </div>

        <label className="l">Número de Documento</label>
        <input className="f" value={docNum} onChange={e => setDocNum(e.target.value)} placeholder="Ej. 1020304050" required />

        <label className="l">Nombre Completo o Razón Social</label>
        <input className="f" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Julian Toscano" required />

        <label className="l">Correo Electrónico</label>
        <input className="f" type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="correo@ejemplo.com" required />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label className="l">Teléfono</label>
            <input className="f" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="3000000000" />
          </div>
          <div>
            <label className="l">Ciudad</label>
            <input className="f" value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="Soacha / Bogotá" />
          </div>
        </div>

        <label className="l">Contraseña</label>
        <input className="f" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Mínimo 8 caracteres" required />

        <p style={{ fontSize: '.75rem', color: 'var(--mu)', marginTop: '8px' }}>
          🔒 Autorizo el tratamiento de mis datos personales de acuerdo con la Ley 1581 de 2012.
        </p>

        <button type="submit" className="bt ac w">Registrarme</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '.85rem' }}>
        ¿Ya tienes cuenta? <button style={{ border: 0, background: 'none', color: 'var(--ac)', fontWeight: 800, cursor: 'pointer' }} onClick={irALogin}>Inicia Sesión aquí</button>
      </p>
    </div>
  );
}
