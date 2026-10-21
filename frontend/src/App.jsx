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
  

  const [usuario, setUsuario] = useState(null);
  const [modalLogin, setModalLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [carrito, setCarrito] = useState([]);
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([
    { nombre: 'Administrador GAPCore', correo: 'admin@gapcore.com', pass: 'Admin123', rol: 'admin' }
  ]);
  const [tickets, setTickets] = useState([
    { id: 1001, asunto: 'Falla en servidor', categoria: 'Hardware', prioridad: 'Alta', descripcion: 'El servidor torre presentó un reinicio inesperado.', cliente: 'Julian Toscano', correo: 'julian@ejemplo.com', estado: 'En proceso' }
  ]);
  const [equipos] = useState([
    { serial: 'SN-0012', nombre: 'Portátil Pro 14', clienteCorreo: 'julian@ejemplo.com', estado: 'Operativo', proxMantenimiento: '12 Nov 2026' },
    { serial: 'SN-0027', nombre: 'Servidor Torre Dell', clienteCorreo: 'admin@gapcore.com', estado: 'Mantenimiento', proxMantenimiento: 'En Curso' }
  ]);

  const [productos] = useState([
    { id: 1, nombre: 'Portátil Pro 14', precio: 3200000, categoria: 'Computadores', enOferta: true, resumen: 'Intel i7, 16GB RAM, SSD 512GB', especificaciones: 'Pantalla 14" FHD, Batería 10h, Peso 1.4kg' },
    { id: 2, nombre: 'Router WiFi 6 Gigabit', precio: 280000, categoria: 'Redes', enOferta: true, resumen: 'Cobertura dual band de alta velocidad', especificaciones: '4 antenas 5dBi, 4 puertos LAN Gigabit' },
    { id: 3, nombre: 'Impresora Láser HP Mono', precio: 890000, categoria: 'Impresoras', enOferta: false, resumen: 'Impresión monocromática rápida para oficina', especificaciones: '30 ppm, ciclo mensual 10.000 pág.' },
    { id: 4, nombre: 'Switch 24 Puertos Cisco', precio: 1150000, categoria: 'Redes', enOferta: false, resumen: 'Switch administrable para rack', especificaciones: 'Gigabit Ethernet, ancho de banda 48 Gbps' },
    { id: 5, nombre: 'PlayStation 5 Slim 1TB', precio: 2499000, categoria: 'Gaming', enOferta: true, resumen: 'Consola de videojuegos de última generación', especificaciones: 'SSD 1TB Ultra-High Speed, 4K HDR' }
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', temaOscuro ? 'dark' : 'light');
  }, [temaOscuro]);

  const toggleTema = () => setTemaOscuro(!temaOscuro);

  const agregarAlCarrito = (prod) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === prod.id);
      if (existe) {
        return prev.map(item => item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const iniciarSesion = (e) => {
    e.preventDefault();
    const mailNormal = loginEmail.trim().toLowerCase();
    const encontrado = usuariosRegistrados.find(u => u.correo === mailNormal);
    
    if (encontrado) {
      setUsuario(encontrado);
      setModalLogin(false);
      setLoginEmail('');
      setLoginPass('');
    } else {
      alert('Usuario no registrado. Regístrate primero en el apartado Registro.');
    }
  };

  const registrarNuevoUsuario = (nuevo) => {
    setUsuariosRegistrados([...usuariosRegistrados, nuevo]);
    setUsuario(nuevo);
    setPaginaActiva('inicio');
    alert('¡Registro exitoso! Sesión iniciada automáticamente.');
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setPaginaActiva('inicio');
  };

  const requiereAutenticacion = (pagina) => {
    if (!usuario && (pagina === 'ayuda' || pagina === 'equipos')) {
      alert('Debes iniciar sesión o registrarte para acceder a este apartado.');
      setModalLogin(true);
      return;
    }
    setPaginaActiva(pagina);
  };

  return (
    <div>
      <header>
        <span className="logo" onClick={() => setPaginaActiva('inicio')} style={{ cursor: 'pointer' }}>
          <b>G</b>AP<small>.core</small>
        </span>

        <button className={`tg ${temaOscuro ? 'd' : ''}`} onClick={toggleTema} title="Cambiar Tema Claro/Oscuro">
          <span>{temaOscuro ? '🌙' : '☀️'}</span>
        </button>

        <label className="sr">
          <input placeholder="Buscar en catálogo..." value={busqueda} onChange={e => { setBusqueda(e.target.value); setPaginaActiva('productos'); }} />
        </label>

        <div className="session-info">
          {usuario ? (
            <>
              <span className="user-badge">{usuario.rol === 'admin' ? '👑 Admin' : '👤 ' + usuario.nombre}</span>
              <button className="bt er" style={{ height: '34px', fontSize: '.75rem' }} onClick={cerrarSesion}>Salir</button>
            </>
          ) : (
            <button className="bt ac" style={{ height: '34px', fontSize: '.75rem' }} onClick={() => setModalLogin(true)}>Iniciar Sesión</button>
          )}
        </div>
      </header>

      <main>
        <nav className="nav-bar">
          <button className={paginaActiva === 'inicio' ? 'on' : ''} onClick={() => setPaginaActiva('inicio')}>Inicio</button>
          <button className={paginaActiva === 'productos' ? 'on' : ''} onClick={() => setPaginaActiva('productos')}>Catálogo</button>
          {!usuario && <button className={paginaActiva === 'clientes' ? 'on' : ''} onClick={() => setPaginaActiva('clientes')}>Registro</button>}
          <button className={paginaActiva === 'pagos' ? 'on' : ''} onClick={() => setPaginaActiva('pagos')}>Pagos ({carrito.reduce((s,i)=>s+i.cantidad,0)})</button>
          <button className={paginaActiva === 'ayuda' ? 'on' : ''} onClick={() => requiereAutenticacion('ayuda')}>Mesa de Ayuda</button>
          <button className={paginaActiva === 'equipos' ? 'on' : ''} onClick={() => requiereAutenticacion('equipos')}>Control Equipos</button>
        </nav>

        {paginaActiva === 'inicio' && <Inicio alIrACatalogo={() => setPaginaActiva('productos')} />}
        {paginaActiva === 'productos' && <ProductosPagina listaProductos={productos} alAgregarAlCarrito={agregarAlCarrito} filtroBusqueda={busqueda} />}
        {paginaActiva === 'clientes' && <ClientesPagina alRegistrar={registrarNuevoUsuario} irALogin={() => setModalLogin(true)} />}
        {paginaActiva === 'pagos' && <PagosPagina carrito={carrito} alVaciar={() => setCarrito([])} alProcesarPago={() => setCarrito([])} />}
        {paginaActiva === 'ayuda' && <AyudaPagina usuario={usuario} tickets={tickets} alCrearTicket={nuevo => setTickets([ { ...nuevo, id: tickets.length + 1001, estado: 'Abierto' }, ...tickets ])} />}
        {paginaActiva === 'equipos' && <EquiposPagina usuario={usuario} equipos={equipos} />}
      </main>

      {modalLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="t" style={{ margin: 0 }}>Iniciar Sesión</h2>
              <button style={{ border: 0, background: 'none', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setModalLogin(false)}>✕</button>
            </div>
            <form onSubmit={iniciarSesion} style={{ marginTop: '16px' }}>
              <label className="l">Correo Electrónico</label>
              <input className="f" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="admin@gapcore.com / tu correo" required />

              <label className="l">Contraseña</label>
              <input className="f" type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Contraseña" required />

              <p style={{ fontSize: '.75rem', color: 'var(--mu)' }}>
                * Para probar el ROL ADMINISTRADOR usa: <b>admin@gapcore.com</b> / <b>Admin123</b>
              </p>

              <button type="submit" className="bt ac w">Ingresar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
