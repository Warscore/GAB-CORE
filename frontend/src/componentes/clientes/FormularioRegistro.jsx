import React, { useState } from 'react';

export default function FormularioRegistro({ alRegistrar, irALogin }) {
  const [docTipo, setDocTipo] = useState('CC');
  const [docNum, setDocNum] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [pass, setPass] = useState('');
  const [aceptaHabeasData, setAceptaHabeasData] = useState(false);
  const [errores, setErrores] = useState({});

  // Lista de ciudades principales de Colombia
  const ciudadesColombia = [
    'Soacha', 'Bogotá D.C.', 'Medellín', 'Cali', 'Barranquilla', 
    'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales', 'Cúcuta', 
    'Ibagué', 'Villavicencio', 'Santa Marta', 'Pastos', 'Montería'
  ];

  // Restricciones de entrada estricta mientras se escribe
  const handleDocNumChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Elimina letras
    setDocNum(val);
  };

  const handleNombreChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''); // Solo letras y espacios
    setNombre(val);
  };

  const handleTelefonoChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // Solo números
    if (val.length <= 10) setTelefono(val);
  };

  const validarFormulario = () => {
    let err = {};

    // Validar Documento
    if (docTipo === 'CC') {
      if (!/^\d{8,10}$/.test(docNum)) err.docNum = 'La cédula debe contener entre 8 y 10 dígitos numéricos.';
    } else if (docTipo === 'NIT') {
      if (!/^\d{9,10}$/.test(docNum)) err.docNum = 'El NIT debe contener 9 o 10 dígitos sin guiones.';
    } else if (docTipo === 'CE') {
      if (!/^\d{6,10}$/.test(docNum)) err.docNum = 'La Cédula de Extranjería debe tener entre 6 y 10 dígitos.';
    }

    // Validar Nombre
    if (nombre.trim().length < 4) {
      err.nombre = 'El nombre completo debe tener al menos 4 letras.';
    }

    // Validar Correo
    if (!correo.toLowerCase().endsWith('@gmail.com')) {
      err.correo = 'El correo electrónico debe ser una cuenta válida terminada en @gmail.com';
    }

    // Validar Teléfono Colombia
    if (!/^3\d{9}$/.test(telefono)) {
      err.telefono = 'El teléfono debe iniciar por 3 y contener exactamente 10 dígitos numéricos.';
    }

    // Validar Ciudad
    if (!ciudad) {
      err.ciudad = 'Seleccione una ciudad válida de la lista.';
    }

    // Validar Contraseña Segura
    const regexPass = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!regexPass.test(pass)) {
      err.pass = 'La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, un número y un símbolo especial.';
    }

    // Validar Habeas Data
    if (!aceptaHabeasData) {
      err.habeas = 'Debe aceptar la política de protección de datos para continuar.';
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      alRegistrar({
        nombre,
        correo: correo.toLowerCase(),
        docNum,
        docTipo,
        telefono,
        ciudad,
        pass,
        rol: 'cliente'
      });
    }
  };

  return (
    <div>
      <h2 className="t" style={{ textAlign: 'center', marginBottom: '20px' }}>REGISTRO DE CLIENT - GAP CORE</h2>
      
      <form onSubmit={handleSubmit}>
        <span className="l">TIPO DE DOCUMENTO</span>
        <div className="seg">
          <button type="button" className={docTipo === 'CC' ? 'on' : ''} onClick={() => { setDocTipo('CC'); setDocNum(''); }}>Cédula</button>
          <button type="button" className={docTipo === 'NIT' ? 'on' : ''} onClick={() => { setDocTipo('NIT'); setDocNum(''); }}>NIT</button>
          <button type="button" className={docTipo === 'CE' ? 'on' : ''} onClick={() => { setDocTipo('CE'); setDocNum(''); }}>Extranjería</button>
        </div>

        <label className="l">NÚMERO DE DOCUMENTO ({docTipo})</label>
        <input 
          className="f" 
          value={docNum} 
          onChange={handleDocNumChange} 
          placeholder={docTipo === 'CC' ? 'Ej. 1020304050' : docTipo === 'NIT' ? 'Ej. 900123456' : 'Ej. 654321'} 
        />
        {errores.docNum && <p className="er" style={{ fontSize: '.78rem', marginTop: '-8px', marginBottom: '10px' }}>{errores.docNum}</p>}

        <label className="l">NOMBRE O RAZÓN SOCIAL (Solo letras)</label>
        <input className="f" value={nombre} onChange={handleNombreChange} placeholder="Ej. Julian David Toscano" />
        {errores.nombre && <p className="er" style={{ fontSize: '.78rem', marginTop: '-8px', marginBottom: '10px' }}>{errores.nombre}</p>}

        <label className="l">CORREO ELECTRÓNICO (@gmail.com)</label>
        <input className="f" type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="usuario@gmail.com" />
        {errores.correo && <p className="er" style={{ fontSize: '.78rem', marginTop: '-8px', marginBottom: '10px' }}>{errores.correo}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label className="l">TELÉFONO (Empieza por 3)</label>
            <input className="f" value={telefono} onChange={handleTelefonoChange} placeholder="3001234567" maxLength="10" />
            {errores.telefono && <p className="er" style={{ fontSize: '.75rem', marginTop: '-8px' }}>{errores.telefono}</p>}
          </div>
          <div>
            <label className="l">CIUDAD</label>
            <select className="f" value={ciudad} onChange={e => setCiudad(e.target.value)}>
              <option value="">-- Seleccionar --</option>
              {ciudadesColombia.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errores.ciudad && <p className="er" style={{ fontSize: '.75rem', marginTop: '-8px' }}>{errores.ciudad}</p>}
          </div>
        </div>

        <label className="l">CONTRASEÑA (Min. 8, Mayúscula, Número y Símbolo)</label>
        <input className="f" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Ej. Colombia2026*" />
        {errores.pass && <p className="er" style={{ fontSize: '.78rem', marginTop: '-8px', marginBottom: '10px' }}>{errores.pass}</p>}

        {/* SWITCH HABAEAS DATA */}
        <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '12px', margin: '14px 0', border: '1px solid var(--bd)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <span style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--tx)' }}>
              Acepto el tratamiento de datos personales conforme a la Ley 1581 de 2012 (Habeas Data).
            </span>
            <input 
              type="checkbox" 
              className="sw" 
              checked={aceptaHabeasData} 
              onChange={e => setAceptaHabeasData(e.target.checked)} 
              style={{ cursor: 'pointer' }}
            />
          </div>
          {errores.habeas && <p className="er" style={{ fontSize: '.75rem', marginTop: '6px', margin: 0 }}>{errores.habeas}</p>}
        </div>

        <button type="submit" className="bt ac w" style={{ height: '48px', fontSize: '.95rem' }}>
          REGISTRARME
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '.88rem' }}>
        ¿Ya tienes cuenta? <button style={{ border: 0, background: 'none', color: 'var(--ac)', fontWeight: 800, cursor: 'pointer' }} onClick={irALogin}>Iniciar sesión</button>
      </p>
    </div>
  );
}
