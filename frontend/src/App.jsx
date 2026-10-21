import React, { useState, useEffect } from 'react';
import './App.css';

import ProductosPagina from './paginas/ProductosPagina';
import ClientesPagina from './paginas/ClientesPagina';
import PagosPagina from './paginas/PagosPagina';
import AyudaPagina from './paginas/AyudaPagina';
import EquiposPagina from './paginas/EquiposPagina';

export default function App() {
  const [temaOscuro, setTemaOscuro] = useState(false);
  
  // ESTADO DE SESIÓN (null significa que la persona NO ha iniciado sesión)
  const [usuario, setUsuario] = useState(null);
  const [vistaAuth, setVistaAuth] = useState('login'); // 'login' o 'registro'

  // Formulario de login inicial
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [errorAuth, setErrorAuth] = useState('');

  // Navegación dentro de la plataforma (una vez autenticado)
  const [paginaActiva, setPaginaActiva] = useState('productos');
  const [busqueda, setBusqueda] = useState('');

  // DATOS Y ESTADOS GLOBALES
  const [carrito, setCarrito] = useState([]);
  
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([
    { nombre: 'Administrador GAPCore', correo: 'admin@gapcore.com', pass: 'Admin123', rol: 'admin' },
    { nombre: 'Julian Toscano', correo: 'julian@ejemplo.com', pass: '12345678', rol: 'cliente' }
  ]);

  const [tickets, setTickets] = useState([
    { id: 101, asunto: 'Falla en red Wi-Fi', categoria: 'Redes', prioridad: 'Alta', descripcion: 'El router principal no emite señal.', cliente: 'Julian Toscano', correo: 'julian@ejemplo.com', estado: 'Abierto' }
  ]);

  const [equipos] = useState([
    { serial: 'SN-0012', nombre: 'Portátil Pro 14', clienteCorreo: 'julian@ejemplo.com', estado: 'Operativo', proxMantenimiento: '12 Nov 2026' },
    { serial: 'SN-0027', nombre: 'Servidor Torre Dell', clienteCorreo: 'admin@gapcore.com', estado: 'Mantenimiento', proxMantenimiento: 'En Curso' }
  ]);

  const [productos] = useState([
    { id: 1, nombre: 'Portátil Pro 14', precio: 3200000, categoria: 'Computadores', enOferta: true, resumen: 'Intel i7, 16GB RAM, SSD 512GB', especificaciones: 'Pantalla 14" FHD, Batería 10h' },
    { id: 2, nombre: 'Router WiFi 6 Gigabit', precio: 280000, categoria: 'Redes', enOferta: true, resumen: 'Alta velocidad y cobertura mesh', especificaciones: '4 antenas, Wi-Fi 6' },
    { id: 3, nombre: 'Impresora Láser HP Mono', precio: 890000, categoria: 'Impresoras', enOferta: false, resumen: 'Impresión rápida monocromática', especificaciones: '30 ppm, USB/Ethernet' },
    { id: 4, nombre: 'Switch 24 Puertos Cisco', precio: 1150000, categoria: 'Redes', enOferta: false, resumen: 'Switch administrable empresarial', especificaciones: 'Gigabit Ethernet' },
    { id: 5, nombre: 'PlayStation 5 Slim 1TB', precio: 2499000, categoria: 'Gaming', enOferta: true, resumen: 'Consola de videojuegos última generación', especificaciones: 'SSD 1TB, 4K' }
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', temaOscuro ? 'dark' : 'light');
  }, [temaOscuro]);

  // FUNCIONES DE AUTENTICACIÓN
  const manejarLogin = (e) => {
    e.preventDefault();
    setErrorAuth('');
    const mail = loginEmail.trim().toLowerCase();
    const userFound = usuariosRegistrados.find(u => u.correo === mail && u.pass === loginPass);
    
    if (userFound) {
      setUsuario(userFound);
      setPaginaActiva('productos');
    } else {
      setErrorAuth('Correo o contraseña incorrectos.');
    }
  };

  const registrarUsuario = (nuevo) => {
    setUsuariosRegistrados([...usuariosRegistrados, nuevo]);
    setUsuario(nuevo);
    setPaginaActiva('productos');
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setCarrito([]);
    setVistaAuth('login');
  };

  // FUNCIONES DEL CARRITO
  const agregarAlCarrito = (prod) => {
    setCarrito(prev => {
      const existe = prev.find(i => i.id === prod.id);
      if (existe) {
        return prev.map(i => i.id === prod.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const modificarCantidad = (id, nuevaCant) => {
    if (nuevaCant <= 0) {
      quitarItemCarrito(id);
      return;
    }
    setCarrito(carrito.map(i => i.id === id ? { ...i, cantidad: nuevaCant } : i));
  };

  const quitarItemCarrito = (id) => {
    setCarrito(carrito.filter(i => i.id !== id));
  };

  // ------------------------------------------------------------------
  // 1. SI EL USUARIO NO HA INICIADO SESIÓN: PANTALLA EXCLUSIVA DE AUTH
  // ------------------------------------------------------------------
  if (!usuario) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', background: 'var(--bg)' }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <button className="bt" style={{ background: 'transparent', color: 'var(--tx)', border: '1px solid var(--bd)' }} onClick={() => setTemaOscuro(!temaOscuro)}>
            {temaOscuro ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
          </button>
        </div>

        <div className="cd" style={{ maxWidth: '480px', width: '100%', padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 className="logo" style={{ fontSize: '2.5rem', margin: 0, color: 'var(--ac)' }}><b>G</b>AP<small>.core</small></h1>
            <p style={{ color: 'var(--mu)', fontSize: '.9rem', margin: '6px 0 0' }}>Plataforma Tecnológica Corporativa</p>
          </div>

          <div className="seg" style={{ justifyContent: 'center', marginBottom: '20px' }}>
            <button className={vistaAuth === 'login' ? 'on' : ''} onClick={() => { setVistaAuth('login'); setErrorAuth(''); }}>Iniciar Sesión</button>
            <button className={vistaAuth === 'registro' ? 'on' : ''} onClick={() => { setVistaAuth('registro'); setErrorAuth(''); }}>Registrarse</button>
          </div>

          {vistaAuth === 'login' ? (
            <form onSubmit={manejarLogin}>
              <h2 className="t" style={{ fontSize: '1.2rem', textAlign: 'center' }}>Acceso a la Cuenta</h2>
              {errorAuth && <p className="er" style={{ textAlign: 'center', fontWeight: 700 }}>{errorAuth}</p>}

              <label className="l">Correo Electrónico</label>
              <input className="f" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="correo@ejemplo.com" required />

              <label className="l">Contraseña</label>
              <input className="f" type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Contraseña" required />

              <button type="submit" className="bt ac w">Ingresar a GAPCore</button>

              <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg)', borderRadius: '10px', fontSize: '.75rem', color: 'var(--mu)' }}>
                <strong>Credenciales de prueba:</strong><br/>
                • <b>Admin:</b> admin@gapcore.com / Admin123<br/>
                • <b>Cliente:</b> julian@ejemplo.com / 12345678
              </div>
            </form>
          ) : (
            <ClientesPagina alRegistrar={registrarUsuario} irALogin={() => setVistaAuth('login')} />
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 2. SI YA INICIÓ SESIÓN: PLATAFORMA COMPLETA DESBLOQUEADA
  // ------------------------------------------------------------------
  return (
    <div>
      <header>
        <span className="logo" onClick={() => setPaginaActiva('productos')}>
          <b>G</b>AP<small>.core</small>
        </span>

        <button style={{ border: 0, background: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }} onClick={() => setTemaOscuro(!temaOscuro)}>
          {temaOscuro ? '🌙 Oscuro' : '☀️ Claro'}
        </button>

        <input className="f" style={{ maxWidth: '320px', margin: 0, height: '38px' }} placeholder="Buscar productos..." value={busqueda} onChange={e => { setBusqueda(e.target.value); setPaginaActiva('productos'); }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '.85rem', fontWeight: 800 }}>
            {usuario.rol === 'admin' ? '👑 Admin' : '👤 ' + usuario.nombre}
          </span>
          <button className="bt er" style={{ height: '32px', fontSize: '.75rem', padding: '0 14px' }} onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
      </header>

      <main>
        <nav className="nav-bar">
          <button className={paginaActiva === 'productos' ? 'on' : ''} onClick={() => setPaginaActiva('productos')}>Catálogo</button>
          <button className={paginaActiva === 'pagos' ? 'on' : ''} onClick={() => setPaginaActiva('pagos')}>Pagos ({carrito.reduce((s,i)=>s+i.cantidad,0)})</button>
          <button className={paginaActiva === 'ayuda' ? 'on' : ''} onClick={() => setPaginaActiva('ayuda')}>Mesa de Ayuda</button>
          <button className={paginaActiva === 'equipos' ? 'on' : ''} onClick={() => setPaginaActiva('equipos')}>Control Equipos</button>
        </nav>

        {paginaActiva === 'productos' && <ProductosPagina productos={productos} alAgregar={agregarAlCarrito} busqueda={busqueda} />}
        {paginaActiva === 'pagos' && <PagosPagina carrito={carrito} alModificarCantidad={modificarCantidad} alQuitarItem={quitarItemCarrito} alVaciarCarrito={() => setCarrito([])} />}
        {paginaActiva === 'ayuda' && <AyudaPagina usuario={usuario} tickets={tickets} alCrearTicket={t => setTickets([{ ...t, id: tickets.length + 101, estado: 'Abierto' }, ...tickets])} alActualizarEstado={id => setTickets(tickets.map(t => t.id === id ? { ...t, estado: 'Resuelto' } : t))} />}
        {paginaActiva === 'equipos' && <EquiposPagina usuario={usuario} equipos={equipos} />}
      </main>
    </div>
  );
}
