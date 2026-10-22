import React, { useState, useEffect } from 'react';
import './App.css';
import ClientesPagina from './paginas/ClientesPagina';
import ProductosPagina from './paginas/ProductosPagina';
import PagosPagina from './paginas/PagosPagina';
import AyudaPagina from './paginas/AyudaPagina';
import EquiposPagina from './paginas/EquiposPagina';
import PanelAdmin from './componentes/admin/PanelAdmin';

// App solo coordina: sesión, tema, carrito y qué apartado se muestra.
// Cada apartado carga y maneja sus propios datos.
export default function App() {
  const [temaOscuro, setTemaOscuro] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [paginaActiva, setPaginaActiva] = useState('productos');
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', temaOscuro ? 'dark' : 'light');
  }, [temaOscuro]);

  // Carrito (se comparte entre Catálogo y Pagos)
  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const ex = prev.find(i => i.id === producto.id);
      if (ex) return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item));
  };

  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario);
    setPaginaActiva(datosUsuario.rol === 'admin' ? 'admin' : 'productos');
  };

  if (!usuario) {
    return (
      <ClientesPagina
        alIniciarSesion={iniciarSesion}
        temaOscuro={temaOscuro}
        alCambiarTema={() => setTemaOscuro(!temaOscuro)}
      />
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

        {usuario.rol === 'admin' && <PanelAdmin usuario={usuario} />}

        {usuario.rol === 'cliente' && paginaActiva === 'productos' && (
          <ProductosPagina busqueda={busqueda} alAgregar={agregarAlCarrito} />
        )}
        {usuario.rol === 'cliente' && paginaActiva === 'pagos' && (
          <PagosPagina
            usuario={usuario}
            carrito={carrito}
            alModificarCantidad={actualizarCantidad}
            alQuitarItem={eliminarDelCarrito}
            alVaciarCarrito={() => setCarrito([])}
          />
        )}
        {usuario.rol === 'cliente' && paginaActiva === 'ayuda' && <AyudaPagina usuario={usuario} />}
        {usuario.rol === 'cliente' && paginaActiva === 'equipos' && <EquiposPagina usuario={usuario} />}
      </main>
    </div>
  );
}
