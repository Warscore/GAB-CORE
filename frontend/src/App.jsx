import React, { useState, useEffect } from 'react';
import './App.css';

import ProductosPagina from './paginas/ProductosPagina';
import ClientesPagina from './paginas/ClientesPagina';
import PagosPagina from './paginas/PagosPagina';
import AyudaPagina from './paginas/AyudaPagina';
import EquiposPagina from './paginas/EquiposPagina';
import PanelAdmin from './componentes/admin/PanelAdmin';

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
  
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([
    { nombre: 'Administrador Principal', correo: 'admin@gapcore.com', pass: 'Admin123', rol: 'admin' },
    { nombre: 'Julian Toscano', correo: 'julian@gmail.com', docTipo: 'CC', docNum: '1020304050', telefono: '3001234567', ciudad: 'Soacha', rol: 'cliente' }
  ]);

  const [ventasGlobales, setVentasGlobales] = useState([
    { id: 'ORD-901', clienteNombre: 'Julian Toscano', clienteCorreo: 'julian@gmail.com', items: [{ nombre: 'Portátil Pro 14', cantidad: 1 }], medioPago: 'PSE (Bancolombia)', total: 3200000 }
  ]);

  const [tickets, setTickets] = useState([
    { id: 101, asunto: 'Pantalla parpadea', categoria: 'Hardware', prioridad: 'Alta', descripcion: 'La pantalla del portátil parpadea ocasionalmente.', cliente: 'Julian Toscano', correo: 'julian@gmail.com', estado: 'Abierto' }
  ]);

  const [equiposGlobales, setEquiposGlobales] = useState([
    { serial: 'SN-0012', nombre: 'Portátil Pro 14', clienteCorreo: 'julian@gmail.com', estado: 'Operativo', diagnostico: 'Sin novedades, mantenimiento al día' },
    { serial: 'SN-0088', nombre: 'Impresora Láser HP', clienteCorreo: 'julian@gmail.com', estado: 'Dañado', diagnostico: 'Rodillo atascado - En reparación' }
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

  const manejarLogin = (e) => {
    e.preventDefault();
    setErrorAuth('');
    const mail = loginEmail.trim().toLowerCase();
    const userFound = usuariosRegistrados.find(u => u.correo === mail && u.pass === loginPass);
    
    if (userFound) {
      setUsuario(userFound);
      setPaginaActiva(userFound.rol === 'admin' ? 'admin' : 'productos');
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

  const agregarAlCarrito = (prod) => {
    setCarrito(prev => {
      const existe = prev.find(i => i.id === prod.id);
      if (existe) {
        return prev.map(i => i.id === prod.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const procesarCompraCliente = (medioPago) => {
    if (carrito.length === 0) return;
    const nuevaVenta = {
      id: 'ORD-' + Math.floor(100 + Math.random() * 900),
      clienteNombre: usuario.nombre,
      clienteCorreo: usuario.correo,
      items: [...carrito],
      medioPago,
      total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
    };
    setVentasGlobales([nuevaVenta, ...ventasGlobales]);

 
    const nuevosEquipos = carrito.map((item, index) => ({
      serial: 'SN-2026-' + Math.floor(1000 + Math.random() * 9000),
      nombre: item.nombre,
      clienteCorreo: usuario.correo,
      estado: 'Operativo',
      diagnostico: 'Comprado recientemente - Nuevo'
    }));

    setEquiposGlobales([...nuevosEquipos, ...equiposGlobales]);
    setCarrito([]);
  };

 
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
            <p style={{ color: 'var(--mu)', fontSize: '.9rem', margin: '6px 0 0' }}>Sistema de Gestión y Soporte</p>
          </div>

          <div className="seg" style={{ justifyContent: 'center', marginBottom: '20px' }}>
            <button className={vistaAuth === 'login' ? 'on' : ''} onClick={() => { setVistaAuth('login'); setErrorAuth(''); }}>Iniciar Sesión</button>
            <button className={vistaAuth === 'registro' ? 'on' : ''} onClick={() => { setVistaAuth('registro'); setErrorAuth(''); }}>Registrarse</button>
          </div>

          {vistaAuth === 'login' ? (
            <form onSubmit={manejarLogin}>
              <h2 className="t" style={{ fontSize: '1.2rem', textAlign: 'center' }}>Acceso al Sistema</h2>
              {errorAuth && <p className="er" style={{ textAlign: 'center', fontWeight: 700 }}>{errorAuth}</p>}

              <label className="l">Correo Electrónico</label>
              <input className="f" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="correo@gmail.com" required />

              <label className="l">Contraseña</label>
              <input className="f" type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Contraseña" required />

              <button type="submit" className="bt ac w">Ingresar</button>

              <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg)', borderRadius: '10px', fontSize: '.75rem', color: 'var(--mu)' }}>
                <strong>Cuentas disponibles:</strong><br/>
                • 👑 <b>Administrador:</b> admin@gapcore.com / Admin123<br/>
                • 👤 <b>Cliente:</b> julian@gmail.com / 12345678
              </div>
            </form>
          ) : (
            <ClientesPagina alRegistrar={registrarUsuario} irALogin={() => setVistaAuth('login')} />
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

        <button style={{ border: 0, background: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }} onClick={() => setTemaOscuro(!temaOscuro)}>
          {temaOscuro ? '🌙 Oscuro' : '☀️ Claro'}
        </button>

        {usuario.rol !== 'admin' && (
          <input className="f" style={{ maxWidth: '320px', margin: 0, height: '38px' }} placeholder="Buscar productos..." value={busqueda} onChange={e => { setBusqueda(e.target.value); setPaginaActiva('productos'); }} />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '.85rem', fontWeight: 800 }}>
            {usuario.rol === 'admin' ? '👑 PANEL ADMINISTRADOR' : '👤 ' + usuario.nombre}
          </span>
          <button className="bt er" style={{ height: '32px', fontSize: '.75rem', padding: '0 14px' }} onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
      </header>

      <main>
      
        <nav className="nav-bar">
          {usuario.rol === 'admin' ? (
            <button className="on">👑 Módulo de Administración</button>
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
            clientes={usuariosRegistrados} 
            ventasGlobales={ventasGlobales} 
            tickets={tickets} 
            alResolverTicket={id => setTickets(tickets.map(t => t.id === id ? { ...t, estado: 'Resuelto' } : t))}
            equiposGlobales={equiposGlobales}
          />
        )}

    
        {usuario.rol === 'cliente' && paginaActiva === 'productos' && (
          <ProductosPagina productos={productos} alAgregar={agregarAlCarrito} busqueda={busqueda} />
        )}
        {usuario.rol === 'cliente' && paginaActiva === 'pagos' && (
          <PagosPagina 
            carrito={carrito} 
            alModificarCantidad={(id, cant) => setCarrito(carrito.map(i => i.id === id ? { ...i, cantidad: cant } : i))} 
            alQuitarItem={id => setCarrito(carrito.filter(i => i.id !== id))} 
            alVaciarCarrito={() => setCarrito([])}
            alProcesarPago={procesarCompraCliente}
          />
        )}
        {usuario.rol === 'cliente' && paginaActiva === 'ayuda' && (
          <AyudaPagina usuario={usuario} tickets={tickets} alCrearTicket={t => setTickets([{ ...t, id: tickets.length + 101, estado: 'Abierto' }, ...tickets])} />
        )}
        {usuario.rol === 'cliente' && paginaActiva === 'equipos' && (
          <EquiposPagina usuario={usuario} equipos={equiposGlobales} />
        )}
      </main>
    </div>
  );
}
