import React, { useState, useEffect } from 'react';
import TarjetaProducto from './TarjetaProducto';

export default function Catalogo({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://gab-core-backend.onrender.com/api';
        const respuesta = await fetch(`${apiUrl}/productos`);
        
        if (!respuesta.ok) {
          throw new Error('Error al conectar con el servidor para obtener el catálogo.');
        }
        
        const datos = await respuesta.json();
        setProductos(datos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  // Filtrado en tiempo real vinculado a la barra de búsqueda superior
  const productosFiltrados = productos.filter(prod =>
    prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (prod.descripcion && prod.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
    (prod.categoria && prod.categoria.toLowerCase().includes(busqueda.toLowerCase()))
  );

  if (cargando) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', padding: '60px', fontSize: '18px' }}>
        Cargando catálogo completo desde la base de datos...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: '#f87171', textAlign: 'center', padding: '60px', fontSize: '16px' }}>
        No se pudo cargar el catálogo: {error}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', padding: '10px 0' }}>
      {/* Barra de Búsqueda Interactiva */}
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '14px 20px',
            borderRadius: '8px',
            border: '1px solid #1f2937',
            backgroundColor: '#111a24',
            color: '#fff',
            fontSize: '16px',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        />
      </div>

      {/* Control de resultados vacíos */}
      {productosFiltrados.length === 0 ? (
        <div style={{ color: '#9ca3af', textAlign: 'center', padding: '40px', fontSize: '16px' }}>
          No se encontraron productos que coincidan con tu búsqueda.
        </div>
      ) : (
        /* Cuadrícula adaptable para mostrar todos los elementos sin límite de 3 */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          width: '100%'
        }}>
          {productosFiltrados.map((producto) => (
            <TarjetaProducto
              key={producto.id}
              producto={producto}
              agregarAlCarrito={agregarAlCarrito}
            />
          ))}
        </div>
      )}
    </div>
  );
}
