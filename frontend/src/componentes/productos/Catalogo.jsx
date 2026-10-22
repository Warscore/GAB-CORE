import React from 'react';
import TarjetaProducto from './TarjetaProducto';

export default function Catalogo({
  productos = [],
  agregarAlCarrito,
  busqueda = '',
  alCambiarBusqueda,
  cargando = false,
  error = '',
}) {
  const termino = busqueda.trim().toLocaleLowerCase('es-CO');
  const productosFiltrados = productos.filter((producto) => {
    const nombre = String(producto.nombre || '').toLocaleLowerCase('es-CO');
    const descripcion = String(producto.descripcion || '').toLocaleLowerCase('es-CO');
    const categoria = String(producto.categoria || '').toLocaleLowerCase('es-CO');
    return nombre.includes(termino) || descripcion.includes(termino) || categoria.includes(termino);
  });

  if (cargando) {
    return <p className="estado-catalogo mu" role="status">Cargando catálogo de productos...</p>;
  }

  if (error) {
    return (
      <div className="estado-catalogo estado-error" role="alert">
        No se pudo cargar el catálogo: {error}
      </div>
    );
  }

  return (
    <section className="catalogo" aria-label="Catálogo de productos">
      {typeof alCambiarBusqueda === 'function' && (
        <div className="catalogo-busqueda">
          <label className="l" htmlFor="busqueda-catalogo">Buscar productos</label>
          <input
            id="busqueda-catalogo"
            className="f"
            type="search"
            placeholder="Nombre, descripción o categoría..."
            value={busqueda}
            onChange={(evento) => alCambiarBusqueda(evento.target.value)}
          />
        </div>
      )}

      {productosFiltrados.length === 0 ? (
        <p className="estado-catalogo mu">
          {termino
            ? 'No se encontraron productos que coincidan con la búsqueda.'
            : 'Todavía no hay productos disponibles.'}
        </p>
      ) : (
        <div className="gd">
          {productosFiltrados.map((producto) => (
            <TarjetaProducto
              key={producto.id}
              producto={producto}
              agregarAlCarrito={agregarAlCarrito}
            />
          ))}
        </div>
      )}
    </section>
  );
}
