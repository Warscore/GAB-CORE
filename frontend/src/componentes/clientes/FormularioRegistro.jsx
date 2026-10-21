import React, { useState } from 'react';

export default function FormularioRegistro({ alRegistrar, irALogin }) {
  const [docTipo, setDocTipo] = useState('CC');
  const [docNum, setDocNum] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!docNum || !nombre || !correo || !pass) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }
    alRegistrar({
      nombre,
      correo: correo.toLowerCase(),
      docNum,
      docTipo,
      telefono,
      ciudad,
      rol: 'cliente'
    });
  };

  return (
    <div className="cd" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <h2 className="t">Registro de Cliente - GAP Core</h2>
      {error && <p className="er" style={{ fontWeight: 700 }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <span className="l">Tipo de Documento</span>
        <div className="seg">
          {['CC', 'NIT', 'CE'].map(t => (
            <button key={t} type="button" className={docTipo === t ? 'on' : ''} onClick={() => setDocTipo(t)}>{t === 'CC' ? 'Cédula' : t === 'NIT' ? 'NIT' : 'Extranjería'}</button>
          ))}
        </div>

        <label className="l">Número de Documento</label>
        <input className="f" value={docNum} onChange={e => setDocNum(e.target.value)} placeholder="Ej. 1020304050" required />

        <label className="l">Nombre o Razón Social</label>
        <input className="f" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Juan Pérez" required />

        <label className="l">Correo Electrónico</label>
        <input className="f" type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="correo@ejemplo.com" required />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

        <p style={{ fontSize: '.75rem', color: 'var(--mu)', margin: '10px 0' }}>
          Protección de datos personales conforme a la Ley 1581 de 2012 en Colombia.
        </p>

        <button type="submit" className="bt ac w">Registrarme</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '.9rem' }}>
        ¿Ya tienes cuenta? <button style={{ border: 0, background: 'none', color: 'var(--ac)', fontWeight: 800, cursor: 'pointer' }} onClick={irALogin}>Iniciar sesión</button>
      </p>
    </div>
  );
}
