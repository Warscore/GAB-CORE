import React from 'react';
import './App.css';
import PantallaAcceso from './componentes/autenticacion/PantallaAcceso';
import PanelAdmin from './componentes/admin/PanelAdmin';
import ProductosPagina from './paginas/ProductosPagina';
import PagosPagina from './paginas/PagosPagina';
import AyudaPagina from './paginas/AyudaPagina';
import EquiposPagina from './paginas/EquiposPagina';
import useGAPCore from './hooks/useGAPCore';

export default function App() {
  const app = useGAPCore();
  const {
    temaOscuro,
    setTemaOscuro,
    usuario,
    paginaActiva,
    setPaginaActiva,
    busqueda,
    setBusqueda,
    carrito,
    productos,
    productosCargando,
    errorProductos,
    clientesAdmin,
    ventasAdmin,
    tickets,
    equipos,
    errorAuth,
    autenticando,
    iniciarSesion,
    registrarCliente,
    cerrarSesion,
    agregarAlCarrito,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    crearTicket,
    resolverTicket,
    recargarDatos,
  } = app;

  if (!usuario) {
    return (
      <PantallaAcceso
        temaOscuro={temaOscuro}
        alCambiarTema={() => setTemaOscuro((actual) => !actual)}
        alIniciarSesion={iniciarSesion}
        alRegistrarCliente={registrarCliente}
        errorAuth={errorAuth}
        autenticando={autenticando}
      />
    );
  }

  const esAdmin = usuario.rol === 'admin';
  const cantidadCarrito = carrito.reduce((total, item) => total + Number(item.cantidad || 0), 0);

  return (
    <div className="aplicacion">
      <header className="app-header">
        <button
          type="button"
          className="logo logo-boton"
          onClick={() => setPaginaActiva(esAdmin ? 'admin' : 'productos')}
          aria-label="Ir al inicio de GAP Core"
        >
          <b>G</b>AP<small>.core</small>
        </button>

        <button
          type="button"
          className="boton-tema-header"
          onClick={() => setTemaOscuro((actual) => !actual)}
        >
          {temaOscuro ? '🌙 Oscuro' : '☀️ Claro'}
        </button>

        {!esAdmin && (
          <input
            className="f busqueda-header"
            type="search"
            aria-label="Buscar productos"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        )}

        <div className="identidad-usuario">
          <span className="nombre-usuario">
            {esAdmin ? '👑 Admin' : `👤 ${usuario.nombre_razon_social || usuario.correo}`}
          </span>
          <button type="button" className="bt er boton-cerrar-sesion" onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main>
        <nav className="nav-bar" aria-label="Navegación principal">
          {esAdmin ? (
            <button type="button" className="on" onClick={() => setPaginaActiva('admin')}>
              👑 Módulo de Administración
            </button>
          ) : (
            <>
              <button
                type="button"
                className={paginaActiva === 'productos' ? 'on' : ''}
                onClick={() => setPaginaActiva('productos')}
              >
                Catálogo
              </button>
              <button
                type="button"
                className={paginaActiva === 'pagos' ? 'on' : ''}
                onClick={() => setPaginaActiva('pagos')}
              >
                Pagos ({cantidadCarrito})
              </button>
              <button
                type="button"
                className={paginaActiva === 'ayuda' ? 'on' : ''}
                onClick={() => setPaginaActiva('ayuda')}
              >
                Mesa de Ayuda
              </button>
              <button
                type="button"
                className={paginaActiva === 'equipos' ? 'on' : ''}
                onClick={() => setPaginaActiva('equipos')}
              >
                Mis Equipos
              </button>
            </>
          )}
        </nav>

        {esAdmin && (
          <PanelAdmin
            clientes={clientesAdmin}
            ventasGlobales={ventasAdmin}
            tickets={tickets}
            alResolverTicket={resolverTicket}
            equiposGlobales={equipos}
          />
        )}

        {!esAdmin && paginaActiva === 'productos' && (
          <ProductosPagina
            productos={productos}
            busqueda={busqueda}
            alAgregar={agregarAlCarrito}
            cargando={productosCargando}
            error={errorProductos}
          />
        )}

        {!esAdmin && paginaActiva === 'pagos' && (
          <PagosPagina
            carrito={carrito}
            usuario={usuario}
            alModificarCantidad={actualizarCantidad}
            alQuitarItem={eliminarDelCarrito}
            alVaciarCarrito={vaciarCarrito}
            alCompletarPago={recargarDatos}
          />
        )}

        {!esAdmin && paginaActiva === 'ayuda' && (
          <AyudaPagina
            usuario={usuario}
            tickets={tickets}
            alCrearTicket={crearTicket}
            alActualizarEstado={resolverTicket}
          />
        )}

        {!esAdmin && paginaActiva === 'equipos' && (
          <EquiposPagina usuario={usuario} equipos={equipos} />
        )}
      </main>
    </div>
  );
}
