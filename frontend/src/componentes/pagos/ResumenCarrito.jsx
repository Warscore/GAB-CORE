import React from 'react';

const formatearPrecio = (valor) => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return 'Precio no disponible';

  return numero.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export default function ResumenCarrito({ carrito = [], vaciarCarrito, actualizarCantidad, eliminarDelCarrito }) {
  const total = carrito.reduce(
    (acumulado, producto) => acumulado + Number(producto.precio || 0) * Number(producto.cantidad || 0),
    0
  );

  return (
    <section className="cd resumen-carrito-panel">
      <h2 className="t resumen-carrito-titulo">Resumen del Pedido</h2>

      {carrito.length === 0 ? (
        <p className="resumen-carrito-vacio">El carrito está vacío. Agrega productos desde el catálogo.</p>
      ) : (
        <div className="resumen-carrito-lista">
          {carrito.map((item) => (
            <article className="cart-line" key={item.id}>
              <div className="resumen-carrito-producto">
                <strong>{item.nombre || 'Producto'}</strong>
                <span>{formatearPrecio(Number(item.precio) * Number(item.cantidad))}</span>
                <small>{formatearPrecio(item.precio)} por unidad</small>
              </div>

              <div className="resumen-carrito-controles" aria-label={`Cantidad de ${item.nombre || 'producto'}`}>
                <button
                  type="button"
                  className="bt boton-cantidad"
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  aria-label={`Disminuir cantidad de ${item.nombre || 'producto'}`}
                >
                  −
                </button>
                <span className="resumen-carrito-cantidad">{item.cantidad}</span>
                <button
                  type="button"
                  className="bt boton-cantidad"
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  aria-label={`Aumentar cantidad de ${item.nombre || 'producto'}`}
                >
                  +
                </button>
                <button
                  type="button"
                  className="bt er boton-eliminar-producto"
                  onClick={() => eliminarDelCarrito(item.id)}
                  aria-label={`Eliminar ${item.nombre || 'producto'} del carrito`}
                  title="Eliminar producto"
                >
                  ✕
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {carrito.length > 0 && (
        <div className="resumen-carrito-total">
          <div className="resumen-carrito-total-linea">
            <span>Total:</span>
            <strong>{formatearPrecio(total)}</strong>
          </div>
          <button type="button" className="bt er w" onClick={vaciarCarrito}>
            Vaciar carrito
          </button>
        </div>
      )}
    </section>
  );
}
