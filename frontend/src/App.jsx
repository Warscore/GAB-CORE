import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://gap-core-backend.onrender.com/api';

export default function App() {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [vistaAuth, setVistaAuth] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [errorAuth, setErrorAuth] = useState('');

  // Registro Estricto Colombia
  const [regTipoDoc, setRegTipoDoc] = useState('CC');
  const [regNumDoc, setRegNumDoc] = useState('');
  const [regNombre, setRegNombre] = useState('');
  const [regCorreo, setRegCorreo] = useState('');
  const [regTel, setRegTel] = useState('');
  const [regCiudad, setRegCiudad] = useState('Soacha');
  const [regPass, setRegPass] = useState('');
  const [habeasData, setHabeasData] = useState(false);

  const [paginaActiva, setPaginaActiva] = useState('productos');
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);

  // Datos Supabase
  const [productos, setProductos] = useState([]);
  const [clientesAdmin, setClientesAdmin] = useState([]);
  const [ventasAdmin, setVentasAdmin] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [equipos, setEquipos] = useState([]);

  // Formulario Ayuda
  const [asuntoTicket, setAsuntoTicket] = useState('');
  const [catTicket, setCatTicket] = useState('Hardware');
  const [prioTicket, setPrioTicket] = useState('Media');
  const [descTicket, setDescTicket] = useState('');

  // Pasarela
  const [medioPago, setMedioPago] = useState('PSE');
  const [bancoPse, setBancoPse] = useState('');
  const [estadoPago, setEstadoPago] = useState('Pendiente');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', temaOscuro ? 'dark' : 'light');
  }, [temaOscuro]);

  useEffect(() => {
    fetch(`${API_URL}/productos`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setProductos(data); })
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  useEffect(() => {
    if (usuario) cargarDatosBackend();
  }, [usuario]);

  const cargarDatosBackend = async () => {
    try {
      const esAdmin = usuario.rol === 'admin';
      const resT = await fetch(`${API_URL}/tickets?cliente_id=${usuario.id}&esAdmin=${esAdmin}`);
      const dataT = await resT.json();
      if (Array.isArray(dataT)) setTickets(dataT);

      const resE = await fetch(`${API_URL}/equipos?cliente_id=${usuario.id}&esAdmin=${esAdmin}`);
      const dataE = await resE.json();
      if (Array.isArray(dataE)) setEquipos(dataE);

      if (esAdmin) {
        const resC = await fetch(`${API_URL}/admin/clientes`);
        const dataC = await resC.json();
        if (Array.isArray(dataC)) setClientesAdmin(dataC);

        const resV = await fetch(`${API_URL}/admin/ordenes`);
        const dataV = await resV.json();
        if (Array.isArray(dataV)) setVentasAdmin(dataV);
      }
    } catch (err) {
      console.error('Error sincronizando datos:', err);
    }
  };

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
        setUsuario(data);
        setPaginaActiva(data.rol === 'admin' ? 'admin' : 'productos');
      } else {
        setErrorAuth(data.error || 'Credenciales incorrectas.');
      }
    } catch (err) {
      setErrorAuth('No se pudo conectar con el servidor.');
    }
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();
    if (!habeasData) {
      alert('Debe aceptar la política de protección de datos (Ley 1581 de 2012).');
      return;
    }
    if (!regCorreo.endsWith('@gmail.com')) {
      alert('El correo electrónico debe terminar obligatoriamente en @gmail.com');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/clientes/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_documento: regTipoDoc,
          numero_documento: regNumDoc,
          nombre_razon_social: regNombre,
          correo: regCorreo,
          telefono: regTel,
          ciudad: regCiudad,
          contrasena: regPass
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert('¡Registro guardado en Supabase con éxito! Ya puedes iniciar sesión.');
        setVistaAuth('login');
      } else {
        alert(data.error || 'Error al registrar.');
      }
    } catch (err) {
      alert('Error de conexión con el backend.');
    }
  };

  const procesarCompra = async () => {
    if (carrito.length === 0) return;
    const total = carrito.reduce((s, i) => s + (i.precio * i.cantidad), 0);
    setEstadoPago('Procesando transacción...');
    try {
      const res = await fetch(`${API_URL}/ordenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: usuario.id, total, medio_pago: medioPago, items: carrito })
      });
      if (res.ok) {
        setEstadoPago('¡Aprobado y guardado en Supabase!');
        setCarrito([]);
        cargarDatosBackend();
      } else {
        setEstadoPago('Error en la pasarela.');
      }
    } catch (err) {
      setEstadoPago('Error de red.');
    }
  };

  const crearTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: usuario.id, asunto: asuntoTicket, categoria: catTicket, prioridad: prioTicket, descripcion: descTicket })
      });
      if (res.ok) {
        setAsuntoTicket('');
        setDescTicket('');
        cargarDatosBackend();
        alert('Ticket enviado con éxito.');
      }
    } catch (err) {
      alert('Error al enviar ticket.');
    }
  };

  const resolverTicket = async (id) => {
    try {
      await fetch(`${API_URL}/tickets/${id}/resolver`, { method: 'PUT' });
      cargarDatosBackend();
    } catch (err) {
      alert('Error al resolver ticket.');
    }
  };

  if (!usuario) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg)', padding: '20px' }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <button className="bt" style={{ background: 'transparent', color: 'var(--tx)', border: '1px solid var(--bd)' }} onClick={() => setTemaOscuro(!temaOscuro)}>
            {temaOscuro ? '🌙 Oscuro' : '☀️ Claro'}
          </button>
        </div>

        <div className="cd" style={{ maxWidth: '480px', width: '100%', padding: '30px' }}>
          <h1 className="logo" style={{ textAlign: 'center', color: 'var(--ac)', fontSize: '2.2rem' }}><b>G</b>AP<small>.core</small></h1>
          
          <div className="seg" style={{ justifyContent: 'center', margin: '20px 0' }}>
            <button className={vistaAuth === 'login' ? 'on' : ''} onClick={() => setVistaAuth('login')}>Iniciar Sesión</button>
            <button className={vistaAuth === 'registro' ? 'on' : ''} onClick={() => setVistaAuth('registro')}>Registrarse</button>
          </div>

          {vistaAuth === 'login' ? (
            <form onSubmit={manejarLogin}>
              {errorAuth && <p className="er" style={{ fontWeight: 700, textAlign: 'center' }}>{errorAuth}</p>}
              <label className="l">Correo Electrónico</label>
              <input className="f" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="admin@gapcore.com" required />
              <label className="l">Contraseña</label>
              <input className="f" type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Contraseña" required />
              <button type="submit" className="bt ac w">Ingresar</button>
              <small className="mu" style={{ display: 'block', textAlign: 'center', marginTop: '12px' }}>Admin: admin@gapcore.com / Admin123</small>
            </form>
          ) : (
            <form onSubmit={manejarRegistro}>
              <span className="l">Tipo Documento</span>
              <div className="seg">
                {['CC', 'NIT', 'CE'].map(t => (
                  <button key={t} type="button" className={regTipoDoc === t ? 'on' : ''} onClick={() => setRegTipoDoc(t)}>{t}</button>
                ))}
              </div>
              <label className="l">N° Documento</label>
              <input className="f" value={regNumDoc} onChange={e => setRegNumDoc(e.target.value.replace(/\D/g, ''))} placeholder="Solo números" required />
              <label className="l">Nombre / Razón Social</label>
              <input className="f" value={regNombre} onChange={e => setRegNombre(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))} placeholder="Solo letras" required />
              <label className="l">Correo (@gmail.com)</label>
              <input className="f" type="email" value={regCorreo} onChange={e => setRegCorreo(e.target.value)} placeholder="correo@gmail.com" required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="l">Teléfono (3...)</label>
                  <input className="f" value={regTel} onChange={e => setRegTel(e.target.value.replace(/\D/g, ''))} placeholder="3001234567" maxLength="10" required />
                </div>
                <div>
                  <label className="l">Ciudad</label>
                  <select className="f" value={regCiudad} onChange={e => setRegCiudad(e.target.value)}>
                    <option value="Soacha">Soacha</option>
                    <option value="Bogotá D.C.">Bogotá D.C.</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Cali">Cali</option>
                  </select>
                </div>
              </div>
              <label className="l">Contraseña Segura</label>
              <input className="f" type="password" value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="Min. 8, Mayús, Núm, Símbolo" required />
              <div style={{ padding: '10px', background: 'var(--bg)', borderRadius: '10px', margin: '10px 0', fontSize: '.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={habeasData} onChange={e => setHabeasData(e.target.checked)} />
                  Acepto el tratamiento de datos (Ley 1581 de 2012).
                </label>
              </div>
              <button type="submit" className="bt ac w">Registrarse en Supabase</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <header>
        <span className="logo" onClick={() => setPaginaActiva(usuario.rol === 'admin' ? 'admin' : 'productos')}>
          <b>G</b>AP<small>.core</small>
        </span>
        <button style={{ border: 0, background: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setTemaOscuro(!temaOscuro)}>
          {temaOscuro ? '🌙 Oscuro' : '☀️ Claro'}
        </button>
        {usuario.rol !== 'admin' && (
          <input className="f" style={{ maxWidth: '280px', margin: 0, height: '36px' }} placeholder="Buscar productos..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '.85rem', fontWeight: 800 }}>{usuario.rol === 'admin' ? '👑 Admin' : '👤 ' + usuario.nombre_razon_social}</span>
          <button className="bt er" style={{ height: '32px', fontSize: '.7rem', padding: '0 12px' }} onClick={() => setUsuario(null)}>Salir</button>
        </div>
      </header>

      <main>
        <nav className="nav-bar">
          {usuario.rol === 'admin' ? (
            <button className="on">👑 Panel de Administración General (Supabase)</button>
          ) : (
            <>
              <button className={paginaActiva === 'productos' ? 'on' : ''} onClick={() => setPaginaActiva('productos')}>Catálogo</button>
              <button className={paginaActiva === 'pagos' ? 'on' : ''} onClick={() => setPaginaActiva('pagos')}>Pagos ({carrito.reduce((s,i)=>s+i.cantidad,0)})</button>
              <button className={paginaActiva === 'ayuda' ? 'on' : ''} onClick={() => setPaginaActiva('ayuda')}>Mesa de Ayuda</button>
              <button className={paginaActiva === 'equipos' ? 'on' : ''} onClick={() => setPaginaActiva('equipos')}>Mis Equipos</button>
            </>
          )}
        </nav>

        {usuario.rol === 'admin' && (
          <div className="cd">
            <h2 className="t">Panel de Control de Administrador</h2>
            
            <h3 style={{ marginTop: '20px' }}>Clientes Registrados</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.85rem', marginBottom: '20px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--bd)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Doc</th>
                  <th style={{ padding: '8px' }}>Nombre</th>
                  <th style={{ padding: '8px' }}>Correo</th>
                  <th style={{ padding: '8px' }}>Ciudad</th>
                </tr>
              </thead>
              <tbody>
                {clientesAdmin.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--bd)' }}>
                    <td style={{ padding: '8px' }}>{c.tipo_documento} {c.numero_documento}</td>
                    <td style={{ padding: '8px' }}>{c.nombre_razon_social}</td>
                    <td style={{ padding: '8px' }}>{c.correo}</td>
                    <td style={{ padding: '8px' }}>{c.ciudad}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Historial Global de Ventas</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.85rem', marginBottom: '20px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--bd)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Orden</th>
                  <th style={{ padding: '8px' }}>Cliente</th>
                  <th style={{ padding: '8px' }}>Total</th>
                  <th style={{ padding: '8px' }}>Pago</th>
                </tr>
              </thead>
              <tbody>
                {ventasAdmin.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid var(--bd)' }}>
                    <td style={{ padding: '8px', fontWeight: 800 }}>#{v.id}</td>
                    <td style={{ padding: '8px' }}>{v.nombre_razon_social} ({v.correo})</td>
                    <td style={{ padding: '8px', color: 'var(--ac)' }}>${Number(v.total).toLocaleString('es-CO')}</td>
                    <td style={{ padding: '8px' }}>{v.medio_pago}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Tickets de Soporte Registrados</h3>
            {tickets.map(t => (
              <div key={t.id} style={{ padding: '12px', background: 'var(--bg)', borderRadius: '10px', marginBottom: '10px', border: '1px solid var(--bd)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                  <span>#{t.id} - {t.asunto} ({t.cliente})</span>
                  <span className={`b ${t.estado === 'Resuelto' ? 'ok' : 'ac'}`}>{t.estado}</span>
                </div>
                <p style={{ margin: '6px 0', fontSize: '.9rem' }}>{t.descripcion}</p>
                {t.estado !== 'Resuelto' && (
                  <button className="bt ac" style={{ height: '26px', fontSize: '.7rem' }} onClick={() => resolverTicket(t.id)}>Resolver</button>
                )}
              </div>
            ))}
          </div>
        )}

        {usuario.rol === 'cliente' && paginaActiva === 'productos' && (
          <div className="gd">
            {productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(p => (
              <div key={p.id} className="pc">
                <div>
                  <span className="b ac">{p.categoria}</span>
                  <h3>{p.nombre}</h3>
                  <p style={{ fontSize: '.85rem', color: 'var(--mu)' }}>{p.descripcion}</p>
                  <div className="pr">${Number(p.precio).toLocaleString('es-CO')} COP</div>
                </div>
                <button className="bt ac" style={{ marginTop: '12px' }} onClick={() => {
                  setCarrito(prev => {
                    const ex = prev.find(i => i.id === p.id);
                    if (ex) return prev.map(i => i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i);
                    return [...prev, { ...p, cantidad: 1 }];
                  });
                  alert('Agregado al carrito');
                }}>Agregar al Carrito</button>
              </div>
            ))}
          </div>
        )}

        {usuario.rol === 'cliente' && paginaActiva === 'pagos' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="cd">
              <h2 className="t">Carrito de Compras</h2>
              {carrito.length === 0 ? <p className="mu">El carrito está vacío.</p> : carrito.map(i => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--bd)' }}>
                  <span>{i.nombre} (x{i.cantidad})</span>
                  <strong>${(i.precio * i.cantidad).toLocaleString('es-CO')}</strong>
                </div>
              ))}
            </div>
            <div className="cd">
              <h2 className="t">Pasarela de Pagos</h2>
              <label className="l">Medio de Pago</label>
              <div className="seg">
                {['PSE', 'Tarjeta', 'Billetera'].map(m => (
                  <button key={m} className={medioPago === m ? 'on' : ''} onClick={() => setMedioPago(m)}>{m}</button>
                ))}
              </div>
              {medioPago === 'PSE' && (
                <select className="f" value={bancoPse} onChange={e => setBancoPse(e.target.value)}>
                  <option value="">-- Seleccionar Banco --</option>
                  <option value="Bancolombia">Bancolombia</option>
                  <option value="Davivienda">Davivienda</option>
                </select>
              )}
              <button className="bt ac w" onClick={procesarCompra} disabled={carrito.length === 0}>Pagar en Supabase</button>
              <div style={{ marginTop: '14px', textAlign: 'center', fontWeight: 800 }}>{estadoPago}</div>
            </div>
          </div>
        )}

        {usuario.rol === 'cliente' && paginaActiva === 'ayuda' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '20px' }}>
            <div className="cd">
              <h2 className="t">Crear Ticket</h2>
              <form onSubmit={crearTicket}>
                <label className="l">Asunto</label>
                <input className="f" value={asuntoTicket} onChange={e => setAsuntoTicket(e.target.value)} required />
                <label className="l">Categoría</label>
                <select className="f" value={catTicket} onChange={e => setCatTicket(e.target.value)}>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Pagos">Pagos</option>
                </select>
                <label className="l">Descripción</label>
                <textarea className="f" rows="3" value={descTicket} onChange={e => setDescTicket(e.target.value)} required></textarea>
                <button type="submit" className="bt ac w">Enviar Ticket</button>
              </form>
            </div>
            <div className="cd">
              <h2 className="t">Mis Tickets</h2>
              {tickets.map(t => (
                <div key={t.id} style={{ padding: '10px', border: '1px solid var(--bd)', borderRadius: '10px', marginBottom: '10px' }}>
                  <strong>{t.asunto}</strong> - <span className="b ok">{t.estado}</span>
                  <p style={{ margin: '4px 0', fontSize: '.85rem' }}>{t.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {usuario.rol === 'cliente' && paginaActiva === 'equipos' && (
          <div className="cd">
            <h2 className="t">Mis Dispositivos Asociados</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--bd)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Serial</th>
                  <th style={{ padding: '10px' }}>Equipo</th>
                  <th style={{ padding: '10px' }}>Estado</th>
                  <th style={{ padding: '10px' }}>Mantenimiento</th>
                </tr>
              </thead>
              <tbody>
                {equipos.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid var(--bd)' }}>
                    <td style={{ padding: '10px', fontWeight: 800 }}>{e.serial}</td>
                    <td style={{ padding: '10px' }}>{e.nombre_equipo}</td>
                    <td style={{ padding: '10px' }}><span className="b ok">{e.estado}</span></td>
                    <td style={{ padding: '10px' }}>{e.proximo_mantenimiento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
