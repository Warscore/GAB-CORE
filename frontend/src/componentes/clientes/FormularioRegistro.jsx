import React, { useState } from 'react';
import { API_URL } from '../../config';

export default function FormularioRegistro({ irALogin }) {
  const [docTipo, setDocTipo] = useState('CC');
  const [docNum, setDocNum] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('Soacha');
  const [pass, setPass] = useState('');
  const [habeasData, setHabeasData] = useState(false);
  const [error, setError] = useState('');

  const ciudadesColombia = ['Soacha', 'Bogotá D.C.', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga'];

  const registrarCliente = async () => {
    try {
      const res = await fetch(`${API_URL}/clientes/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_documento: docTipo,
          numero_documento: docNum,
          nombre_razon_social: nombre,
          correo: correo.toLowerCase(),
          telefono,
          ciudad,
          contrasena: pass
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert('¡Registro guardado exitosamente en Supabase!');
        irALogin();
      } else {
        alert(data.error || 'Error al registrar.');
      }
    } catch (err) {
      alert('Error de conexión.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!docNum || !nombre || !correo || !telefono || !pass) {
      setError('Por favor complete todos los campos.');
      return;
    }
    if (!correo.toLowerCase().endsWith('@gmail.com')) {
      setError('El correo debe terminar obligatoriamente en @gmail.com');
      return;
    }
    if (!telefono.startsWith('3') || telefono.length !== 10) {
      setError('El teléfono en Colombia debe iniciar por 3 y tener 10 dígitos.');
      return;
    }
    if (!habeasData) {
      setError('Debe aceptar la política de protección de datos (Ley 1581 de 2012).');
      return;
    }

    registrarCliente();
  };

  return (
    <div>
      <h2 className="t" style={{ textAlign: 'center', marginBottom: '16px' }}>Registro de Cliente</h2>
      {error && <p className="er" style={{ fontWeight: 700, textAlign: 'center' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <span className="l">Tipo de Documento</span>
        <div className="seg">
          {['CC', 'NIT', 'CE'].map(t => (
            <button key={t} type="button" className={docTipo === t ? 'on' : ''} onClick={() => setDocTipo(t)}>{t}</button>
          ))}
        </div>

        <label className="l">Número de Documento</label>
        <input className="f" value={docNum} onChange={e => setDocNum(e.target.value.replace(/\D/g, ''))} placeholder="Ej. 1020304050" required />

        <label className="l">Nombre o Razón Social (Solo letras)</label>
        <input className="f" value={nombre} onChange={e => setNombre(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))} placeholder="Ej. Julian Toscano" required />

        <label className="l">Correo Electrónico (@gmail.com)</label>
        <input className="f" type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="correo@gmail.com" required />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label className="l">Teléfono (Inicia en 3)</label>
            <input className="f" value={telefono} onChange={e => setTelefono(e.target.value.replace(/\D/g, ''))} placeholder="3001234567" maxLength="10" required />
          </div>
          <div>
            <label className="l">Ciudad</label>
            <select className="f" value={ciudad} onChange={e => setCiudad(e.target.value)}>
              {ciudadesColombia.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <label className="l">Contraseña Segura</label>
        <input className="f" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Mínimo 8 caracteres" required />

        <div style={{ padding: '10px', background: 'var(--bg)', borderRadius: '10px', margin: '14px 0', fontSize: '.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={habeasData} onChange={e => setHabeasData(e.target.checked)} />
            Acepto el tratamiento de datos personales (Ley 1581 de 2012).
          </label>
        </div>

        <button type="submit" className="bt ac w">Registrarse en Supabase</button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '.9rem' }}>
        ¿Ya tienes cuenta? <button style={{ border: 0, background: 'none', color: 'var(--ac)', fontWeight: 800, cursor: 'pointer' }} onClick={irALogin}>Iniciar sesión</button>
      </p>
    </div>
  );
}
