import React, { useState, useEffect } from 'react';
import './App.css';

import Inicio from './paginas/Inicio';
import ProductosPagina from './paginas/ProductosPagina';
import ClientesPagina from './paginas/ClientesPagina';
import PagosPagina from './paginas/PagosPagina';
import AyudaPagina from './paginas/AyudaPagina';
import EquiposPagina from './paginas/EquiposPagina';

export default function App() {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [paginaActiva, setPaginaActiva] = useState('inicio');
  const [busqueda, setBusqueda] = useState('');
  
  // Estado de sesión y base de datos simulada en memoria
  const [usuario, setUsuario] = useState(null);
  const [modalLogin, setModalLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [carrito, setCarrito] = useState([]);
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([
    { nombre: 'Administrador General', correo: 'admin@gapcore.com', pass: 'Admin123', rol: 'admin' }
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

  const agregarAlCarrito = (prod) => {
    setCarrito(prev => {
      const existe = prev.find(i => i.id === prod.id);
      if (existe) {
        return prev.map(i => i.id === prod.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { ...prod, cantidad: 1 }];
    });
    alert(prod.nombre + " agregado al carrito.");
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

  const manejarLogin = (e) => {
    e.preventDefault();
    const mail = loginEmail.trim().toLowerCase();
    const userFound = usuariosRegistrados.find(u => u.correo === mail && u.pass === loginPass);
    if (userFound) {
      setUsuario(userFound);
      setModalLogin(false);
      setLoginEmail('');
      setLoginPass('');
    } else {
      alert('Correo o contraseña incorrectos.');
    }
  };

  const registrarUsuario = (nuevo) => {
    setUsuariosRegistrados([...usuariosRegistrados, nuevo]);
    setUsuario(nuevo);
    setPaginaActiva('inicio');
    alert('¡Cuenta creada e inicio de sesión exitoso!');
  };

  const verificarAccesoProtegido = (destino) => {
    if (!usuario) {
      alert('Debe iniciar sesión o registrarse para acceder a este apartado.');
      setModalLogin(true);
      return;
    }
    setPaginaActiva(destino);
  };

  return (
    <div>
      <header>
        <span className="logo" onClick={() => setPaginaActiva('inicio')}>
          <b>G</b>AP<small>.core</small>
        </span>

        <button style={{ border: 0, background: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => setTemaOscuro(!temaOscuro)}>
          {temaOscuro ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </button>

        <input className="f" style={{ maxWidth: '350px', margin: 0 }} placeholder="Buscar productos..." value={busqueda} onChange={e => { setBusqueda(e.target.value); setPaginaActiva('productos'); }} />

        <div>
          {usuario ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '.85rem', fontWeight: 800 }}>{usuario.rol === 'admin' ? '👑 Admin' : '👤 ' + usuario.nombre}</span>
              <button className="bt er" style={{ height: '32px', fontSize: '.7rem', padding: '0 14px' }} onClick={() => setUsuario(null)}>Salir</button>
            </div>
          ) : (
            <button className="bt ac" style={{ height: '34px', fontSize: '.75rem', padding: '0 16px' }} onClick={() => setModalLogin(true)}>Iniciar Sesión</button>
          )}
        </div>
      </header>

      <main>
        <nav className="nav-bar">
          <button className={paginaActiva === 'inicio' ? 'on' : ''} onClick={() => setPaginaActiva('inicio')}>Inicio</button>
          <button className={paginaActiva === 'productos' ? 'on' : ''} onClick={() => setPaginaActiva('productos')}>Catálogo</button>
          {!usuario && <button className={paginaActiva === 'clientes' ? 'on' : ''} onClick={() => setPaginaActiva('clientes')}>Registro</button>}
          <button className={paginaActiva === 'pagos' ? 'on' : ''} onClick={() => setPaginaActiva('pagos')}>Pagos ({carrito.reduce((s,i)=>s+i.cantidad,0)})</button>
          <button className={paginaActiva === 'ayuda' ? 'on' : ''} onClick={() => verificarAccesoProtegido('ayuda')}>Mesa de Ayuda</button>
          <button className={paginaActiva === 'equipos' ? 'on' : ''} onClick={() => verificarAccesoProtegido('equipos')}>Control Equipos</button>
        </nav>

        {paginaActiva === 'inicio' && <Inicio irACatalogo={() => setPaginaActiva('productos')} />}
        {paginaActiva === 'productos' && <ProductosPagina productos={productos} alAgregar={agregarAlCarrito} busqueda={busqueda} />}
        {paginaActiva === 'clientes' && <ClientesPagina alRegistrar={registrarUsuario} irALogin={() => setModalLogin(true)} />}
        {paginaActiva === 'pagos' && <PagosPagina carrito={carrito} alModificarCantidad={modificarCantidad} alQuitarItem={quitarItemCarrito} alVaciarCarrito={() => setCarrito([])} />}
        {paginaActiva === 'ayuda' && <AyudaPagina usuario={usuario} tickets={tickets} alCrearTicket={t => setTickets([{ ...t, id: tickets.length + 101, estado: 'Abierto' }, ...tickets])} alActualizarEstado={id => setTickets(tickets.map(t => t.id === id ? { ...t, estado: 'Resuelto' } : t))} />}
        {paginaActiva === 'equipos' && <EquiposPagina usuario={usuario} equipos={equipos} />}
      </main>

      {modalLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="t" style={{ margin: 0 }}>Iniciar Sesión</h2>
              <button style={{ border: 0, background: 'none', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setModalLogin(false)}>✕</button>
            </div>
            <form onSubmit={manejarLogin}>
              <label className="l">Correo Electrónico</label>
              <input className="f" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="admin@gapcore.com" required />

              <label className="l">Contraseña</label>
              <input className="f" type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Contraseña" required />

              <p style={{ fontSize: '.75rem', color: 'var(--mu)', margin: '8px 0 16px' }}>
                * Credenciales de Administrador predeterminadas: <b>admin@gapcore.com</b> / <b>Admin123</b>
              </p>

              <button type="submit" className="bt ac w">Ingresar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
