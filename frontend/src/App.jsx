import React, { useState, useEffect } from 'react';
import './App.css';
import FormularioRegistro from './componentes/clientes/FormularioRegistro';
import PanelAdmin from './componentes/admin/PanelAdmin';

const API_URL = import.meta.env.VITE_API_URL || 'https://gab-core-backend.onrender.com/api';

export default function App() {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [vistaAuth, setVistaAuth] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [errorAuth, setErrorAuth] = useState('');

  const [paginaActiva, setPaginaActiva] = useState('productos');
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);

  // Datos de Supabase
  const [productos, setProductos] = useState([]);
  const [clientesAdmin, setClientesAdmin] = useState([]);
  const [ventasAdmin, setVentasAdmin] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [equipos, setEquipos] = useState([]);

  // Formulario de Ayuda
  const [asunto, setAsunto] = useState('');
  const [categoria, setCategoria] = useState('Hardware');
  const [prioridad, setPrioridad] = useState('Media');
  const [descripcion, setDescripcion] = useState('');

  // Pasarela de Pagos Dinámica
  const [medioPago, setMedioPago] = useState('PSE');
  const [bancoSeleccionado, setBancoSeleccionado] = useState('');
  const [datosTarjeta, setDatosTarjeta] = useState({ numero: '', fecha: '', cvc: '' });
  const [billeteraTipo, setBilleteraTipo] = useState('Nequi');
  const [telefonoBilletera, setTelefonoBilletera] = useState('');
  const [estadoTransaccion, setEstadoTransaccion] = useState('Pendiente');

  // Bancos PSE ampliados para Colombia
  const bancosPSE = [
    'Bancolombia',
    'Banco de Bogotá',
    'Davivienda',
    'BBVA Colombia',
    'Banco de Occidente',
    'Banco Popular',
    'Banco AV Villas',
    'Scotiabank Colpatria',
    'Banco Caja Social',
    'Banco Falabella',
    'Nequi (PSE)',
    'Daviplata (PSE)',
    'Lulo Bank',
    'Nu Colombia',
    'RappiPay',
    'Banco Agrario de Colombia',
    'Banco Pichincha'
  ];

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

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
    if (usuario) cargarDatos();
  }, [usuario]);

  const cargarDatos = async () => {
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
      console.error('Error cargando datos de Supabase:', err);
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

  const registrarCliente = async (nuevo) => {
    try {
      const res = await fetch(`${API_URL}/clientes/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_documento: nuevo.docTipo,
          numero_documento: nuevo.docNum,
          nombre_razon_social: nuevo.nombre,
          correo: nuevo.correo,
          telefono: nuevo.telefono,
          ciudad: nuevo.ciudad,
          contrasena: nuevo.pass
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert('¡Registro guardado exitosamente en Supabase!');
        setVistaAuth('login');
      } else {
        alert(data.error || 'Error al registrar.');
      }
    } catch (err) {
      alert('Error de conexión.');
    }
  };

  const procesarPago = async () => {
    if (carrito.length === 0) return;

    if (medioPago === 'PSE' && !bancoSeleccionado) {
      alert('Por favor selecciona un banco para continuar con PSE.');
      return;
    }
    if (medioPago === 'Tarjeta' && (!datosTarjeta.numero || !datosTarjeta.fecha || !datosTarjeta.cvc)) {
      alert('Por favor completa todos los datos de la tarjeta.');
      return;
    }
    if (medioPago === 'Billetera' && !telefonoBilletera) {
      alert('Por favor ingresa el número de celular asociado a la billetera digital.');
      return;
    }

    const total = carrito.reduce((s, i) => s + (i.precio * i.cantidad), 0);
    setEstadoTransaccion('Conectando con la entidad financiera...');

    let descripcionMedio = medioPago;
    if (medioPago === 'PSE') descripcionMedio = `PSE (${bancoSeleccionado})`;
    if (medioPago === 'Tarjeta') descripcionMedio = 'Tarjeta de Crédito/Débito';
    if (medioPago === 'Billetera') descripcionMedio = `Billetera ${billeteraTipo} (${telefonoBilletera})`;

    try {
      const res = await fetch(`${API_URL}/ordenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: usuario.id, total, medio_pago: descripcionMedio, items: carrito })
      });
      if (res.ok) {
        setEstadoTransaccion('Aprobado. Guardado en Supabase.');
        setCarrito([]);
        cargarDatos();
      } else {
        setEstadoTransaccion('Error en la transacción.');
      }
    } catch (err) {
      setEstadoTransaccion('Error de red.');
    }
  };

  const crearTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: usuario.id, asunto, categoria, prioridad, descripcion })
      });
      if (res.ok) {
        setAsunto('');
        setDescripcion('');
        cargarDatos();
        alert('Ticket creado con éxito.');
      }
    } catch (err) {
      alert('Error al crear ticket.');
    }
  };

  const resolverTicket = async (id) => {
    await fetch(`${API_URL}/tickets/${id}/resolver`, { method: 'PUT' });
    cargarDatos();
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
          <h1 className="logo" style={{ textAlign: 'center', color: 'var(--ac)', fontSize: '2.5rem' }}><b>G</b>AP<small>.core</small></h1>
          
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
              <small className="mu" style={{ display: 'block', textAlign: 'center', marginTop: '12px' }}>Admin por defecto: admin@gapcore.com / Admin123</small>
            </form>
          ) : (
            <FormularioRegistro alRegistrar={registrarCliente} irALogin={() => setVistaAuth('login')} />
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
          <button className="bt er" style={{ height: '32px', fontSize: '.7rem', padding: '0 12px' }} onClick={() => setUsuario(null)}>Cerrar Sesión</button>
        </div>
      </header>

      <main>
        <nav className="nav-bar">
          {usuario.rol === 'admin' ? (
            <button className="on">👑 Módulo de Administración (Supabase)</button>
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
          <PanelAdmin 
            clientes={clientesAdmin} 
            ventasGlobales={ventasAdmin} 
            tickets={tickets} 
            alResolverTicket={resolverTicket}
            equiposGlobales={equipos}
          />
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
            {/* Resumen del pedido con botones + / - y eliminar */}
            <div className="cd">
              <h2 className="t">Resumen del Pedido</h2>
              {carrito.length === 0 ? <p className="mu">El carrito está vacío.</p> : carrito.map(i => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--bd)' }}>
                  <div>
                    <strong>{i.nombre}</strong>
                    <div className="mu">${Number(i.precio).toLocaleString('es-CO')} c/u</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button className="bt" style={{ padding: '2px 8px', height: '28px' }} onClick={() => actualizarCantidad(i.id, i.cantidad - 1)}>-</button>
                    <span style={{ fontWeight: 'bold' }}>{i.cantidad}</span>
                    <button className="bt" style={{ padding: '2px 8px', height: '28px' }} onClick={() => actualizarCantidad(i.id, i.cantidad + 1)}>+</button>
                    <button className="bt er" style={{ padding: '2px 8px', height: '28px', fontSize: '.8rem' }} onClick={() => eliminarDelCarrito(i.id)}>✕</button>
                  </div>
                </div>
              ))}
              {carrito.length > 0 && (
                <button className="bt er w" style={{ marginTop: '16px' }} onClick={() => setCarrito([])}>Vaciar Carrito</button>
              )}
            </div>

            {/* Pasarela de pagos interactiva con campos dinámicos */}
            <div className="cd">
              <h2 className="t">Pasarela de Pagos</h2>
              <label className="l">Medio de Pago</label>
              <div className="seg">
                {['PSE', 'Tarjeta', 'Billetera'].map(m => (
                  <button key={m} className={medioPago === m ? 'on' : ''} onClick={() => setMedioPago(m)}>{m}</button>
                ))}
              </div>

              {medioPago === 'PSE' && (
                <div style={{ marginTop: '12px' }}>
                  <label className="l">Seleccionar Banco</label>
                  <select className="f" value={bancoSeleccionado} onChange={e => setBancoSeleccionado(e.target.value)}>
                    <option value="">-- Seleccionar Banco --</option>
                    {bancosPSE.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              )}

              {medioPago === 'Tarjeta' && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="l">Datos de Tarjeta</label>
                  <input className="f" type="text" placeholder="Número de Tarjeta" value={datosTarjeta.numero} onChange={e => setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input className="f" type="text" placeholder="MM/AA" value={datosTarjeta.fecha} onChange={e => setDatosTarjeta({ ...datosTarjeta, fecha: e.target.value })} />
                    <input className="f" type="password" placeholder="CVC" maxLength="4" value={datosTarjeta.cvc} onChange={e => setDatosTarjeta({ ...datosTarjeta, cvc: e.target.value })} />
                  </div>
                </div>
              )}

              {medioPago === 'Billetera' && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="l">Billetera Digital</label>
                  <select className="f" value={billeteraTipo} onChange={e => setBilleteraTipo(e.target.value)}>
                    <option value="Nequi">Nequi</option>
                    <option value="Daviplata">Daviplata</option>
                    <option value="Dale!">Dale!</option>
                    <option value="Movii">Movii</option>
                  </select>
                  <input className="f" type="tel" placeholder="Número de Celular" value={telefonoBilletera} onChange={e => setTelefonoBilletera(e.target.value)} />
                </div>
              )}

              <button className="bt ac w" style={{ marginTop: '16px' }} onClick={procesarPago} disabled={carrito.length === 0}>Pagar Ahora</button>
              <div style={{ marginTop: '16px', textAlign: 'center', fontWeight: 800 }}>{estadoTransaccion}</div>
            </div>
          </div>
        )}

        {usuario.rol === 'cliente' && paginaActiva === 'ayuda' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '20px' }}>
            <div className="cd">
              <h2 className="t">Nuevo Ticket de Soporte</h2>
              <form onSubmit={crearTicket}>
                <label className="l">Asunto</label>
                <input className="f" value={asunto} onChange={e => setAsunto(e.target.value)} required />
                <label className="l">Categoría</label>
                <select className="f" value={categoria} onChange={e => setCategoria(e.target.value)}>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Pagos">Pagos</option>
                </select>
                <label className="l">Prioridad</label>
                <select className="f" value={prioridad} onChange={e => setPrioridad(e.target.value)}>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
                <label className="l">Descripción</label>
                <textarea className="f" rows="3" value={descripcion} onChange={e => setDescripcion(e.target.value)} required></textarea>
                <button type="submit" className="bt ac w">Enviar Ticket</button>
              </form>
            </div>
            <div className="cd">
              <h2 className="t">Mis Tickets Registrados</h2>
              {tickets.map(t => (
                <div key={t.id} style={{ padding: '12px', border: '1px solid var(--bd)', borderRadius: '10px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                    <span>{t.asunto}</span>
                    <span className={`b ${t.estado === 'Resuelto' ? 'ok' : 'ac'}`}>{t.estado}</span>
                  </div>
                  <p style={{ margin: '6px 0', fontSize: '.9rem' }}>{t.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {usuario.rol === 'cliente' && paginaActiva === 'equipos' && (
          <div className="cd">
            <h2 className="t">Mis Dispositivos en Funcionamiento</h2>
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
