import React, { useState } from 'react';
import TarjetaProducto from '../componentes/productos/TarjetaProducto';

export default function ProductosPagina({ listaProductos, alAgregarAlCarrito, filtroBusqueda }) {
  const [categoria, setCategoria] = useState('Todas');

  const filtrados = listaProductos.filter(p => {
    const coincideCat = categoria === 'Todas' || (categoria === 'Ofertas' ? p.enOferta : p.categoria === categoria);
    const coincideText = p.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) || p.categoria.toLowerCase().includes(filtroBusqueda.toLowerCase());
    return coincideCat && coincideText;
  });

  return (
    <div>
      <div className="seg">
        {['Todas', 'Ofertas', 'Computadores', 'Redes', 'Impresoras', 'Gaming', 'Accesorios'].map(cat => (
          <button key={cat} className={categoria === cat ? 'on' : ''} onClick={() => setCategoria(cat)}>{cat}</button>
        ))}
      </div>
      <div className="gd">
        {filtrados.length === 0 ? (
          <p className="mu">No se encontraron productos que coincidan.</p>
        ) : (
          filtrados.map(prod => <TarjetaProducto key={prod.id} producto={prod} alAgregar={alAgregarAlCarrito} />)
        )}
      </div>
    </div>
  );
}
