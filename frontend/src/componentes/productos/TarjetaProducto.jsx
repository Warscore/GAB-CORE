import React from 'react';

export default function TarjetaProducto({ producto, agregarAlCarrito }) {
  const precio = Number(producto.precio);
  const precioFormateado = Number.isFinite(precio)
    ? precio.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    : 'Precio no disponible';

  return (
    <article className="pc">
      <div>
        <span className="b ac">{producto.categoria || 'Sin categoría'}</span>
        <h3>{producto.nombre || 'Producto sin nombre'}</h3>
        <p className="producto-descripcion">
          {producto.descripcion || 'Sin descripción disponible.'}
        </p>
      </div>

      <div>
        <div className="pr">{precioFormateado}</div>
        <button
          type="button"
          className="bt ac w"
          onClick={() => agregarAlCarrito(producto)}
          disabled={!Number.isFinite(precio)}
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}
