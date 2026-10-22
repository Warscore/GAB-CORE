import React, { useState } from 'react';

export default function Pasarela({ carrito, vaciarCarrito, actualizarCantidad, eliminarDelCarrito, usuario, alCompletarPago }) {
  const [medioPago, setMedioPago] = useState('PSE');
  const [bancoSeleccionado, setBancoSeleccionado] = useState('');
  
  // Datos específicos para Tarjeta
  const [datosTarjeta, setDatosTarjeta] = useState({ numero: '', fecha: '', cvc: '' });
  
  // Datos específicos para Billetera Digital
  const [billeteraTipo, setBilleteraTipo] = useState('Nequi');
  const [telefonoBilletera, setTelefonoBilletera] = useState('');

  const [procesando, setProcesando] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState('Pendiente');

  // Lista ampliada de entidades financieras y billeteras por PSE
  const bancosPSE = [
    'Bancolombia',
    'Banco de Bogotá',
    'Davivienda',
    'BBVA Colombia',
    'Banco de Occidente',
    'Banco Popular',
    'Banco AV Villas',
    'Scotiabank Colpatria',
    'Banco Caja Social',
    'Banco Falabella',
    'Nequi (PSE)',
    'Daviplata (PSE)',
    'Lulo Bank',
    'Nu Colombia',
    'RappiPay',
    'Banco Agrario de Colombia',
    'Banco Pichincha'
  ];

  const formatearPrecio = (precio) => {
    return new Number(precio).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
  };

  const manejarPago = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    if (medioPago === 'PSE' && !bancoSeleccionado) {
      alert('Por favor selecciona tu banco para continuar con PSE.');
      return;
    }

    if (medioPago === 'Tarjeta' && (!datosTarjeta.numero || !datosTarjeta.fecha || !datosTarjeta.cvc)) {
      alert('Por favor completa todos los datos de la tarjeta.');
      return;
    }

    if (medioPago === 'Billetera' && !telefonoBilletera) {
      alert('Por favor ingresa el número celular vinculado a la billetera digital.');
      return;
    }

    setProcesando(true);
    setMensajeEstado('Conectando con la entidad financiera...');

    let descripcionMedio = medioPago;
    if (medioPago === 'PSE') descripcionMedio = `PSE (${bancoSeleccionado})`;
    if (medioPago === 'Tarjeta') descripcionMedio = 'Tarjeta de Crédito/Débito';
    if (medioPago === 'Billetera') descripcionMedio = `Billetera ${billeteraTipo} (${telefonoBilletera})`;

    try {
      const total = calcularTotal();
      const apiUrl = import.meta.env.VITE_API_URL || 'https://gab-core-backend.onrender.com/api';

      const respuesta = await fetch(`${apiUrl}/ordenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: usuario.id,
          total: total,
          medio_pago: descripcionMedio,
          items: carrito
        })
      });

      if (!respuesta.ok) {
        throw new Error('Error al registrar la transacción.');
      }

      setMensajeEstado('¡Aprobado y guardado en Supabase!');
      setTimeout(() => {
        vaciarCarrito();
        setMensajeEstado('Pendiente');
        setProcesando(false);
        if (alCompletarPago) alCompletarPago();
      }, 1500);

    } catch (error) {
      setMensajeEstado('Error al procesar el pago.');
      setProcesando(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
      {/* SECCIÓN 1: Resumen del Pedido con control de cantidades */}
      <div style={{
        backgroundColor: '#111a24',
        border: '1px solid #1f2937',
        borderRadius: '16px',
        padding: '24px',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '400px'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '20px', textTransform: 'uppercase' }}>
            Resumen del Pedido
          </h2>

          {carrito.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', margin: '40px 0' }}>
              El carrito está vacío.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {carrito.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    paddingBottom: '12px', 
                    borderBottom: '1px solid #1f2937' 
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '10px' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#fff', fontWeight: '600' }}>
                      {item.nombre}
                    </h4>
                    <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold' }}>
                      {formatearPrecio(item.precio * item.cantidad)}
                    </span>
                  </div>

                  {/* Controles de cantidad (+ / - / eliminar) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '4px',
                        border: '1px solid #374151',
                        backgroundColor: '#1f2937',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      -
                    </button>

                    <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                      {item.cantidad}
                    </span>

                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '4px',
                        border: '1px solid #374151',
                        backgroundColor: '#1f2937',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      +
                    </button>

                    <button
                      onClick={() => eliminarDelCarrito(item.id)}
                      title="Eliminar producto"
                      style={{
                        marginLeft: '6px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#f87171',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {carrito.length > 0 && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#9ca3af' }}>Total:</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>
                {formatearPrecio(calcularTotal())}
              </span>
            </div>

            <button
              onClick={vaciarCarrito}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              VACIAR CARRITO
            </button>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: Pasarela de Pagos con PSE ampliado y campos dinámicos */}
      <div style={{
        backgroundColor: '#111a24',
        border: '1px solid #1f2937',
        borderRadius: '16px',
        padding: '24px',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '20px', textTransform: 'uppercase' }}>
            Pasarela de Pagos
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase' }}>
              Medio de Pago
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['PSE', 'Tarjeta', 'Billetera'].map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setMedioPago(tipo)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #374151',
                    backgroundColor: medioPago === tipo ? '#0284c7' : '#1f2937',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          {/* Opciones de PSE (Lista ampliada de bancos) */}
          {medioPago === 'PSE' && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>Seleccionar Banco</label>
              <select
                value={bancoSeleccionado}
                onChange={(e) => setBancoSeleccionado(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #374151',
                  backgroundColor: '#1f2937',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="">-- Seleccionar Banco --</option>
                {bancosPSE.map((banco) => (
                  <option key={banco} value={banco}>{banco}</option>
                ))}
              </select>
            </div>
          )}

          {/* Datos de Tarjeta */}
          {medioPago === 'Tarjeta' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '-2px' }}>Datos de Tarjeta</label>
              <input
                type="text"
                placeholder="Número de Tarjeta"
                value={datosTarjeta.numero}
                onChange={(e) => setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#fff' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={datosTarjeta.fecha}
                  onChange={(e) => setDatosTarjeta({ ...datosTarjeta, fecha: e.target.value })}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#fff' }}
                />
                <input
                  type="password"
                  placeholder="CVC"
                  maxLength="4"
                  value={datosTarjeta.cvc}
                  onChange={(e) => setDatosTarjeta({ ...datosTarjeta, cvc: e.target.value })}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#fff' }}
                />
              </div>
            </div>
          )}

          {/* Datos de Billetera Digital */}
          {medioPago === 'Billetera' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '-2px' }}>Billetera Digital</label>
              <select
                value={billeteraTipo}
                onChange={(e) => setBilleteraTipo(e.target.value)}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#fff' }}
              >
                <option value="Nequi">Nequi</option>
                <option value="Daviplata">Daviplata</option>
                <option value="Dale!">Dale!</option>
                <option value="Movii">Movii</option>
              </select>
              <input
                type="tel"
                placeholder="Número de celular registrado"
                value={telefonoBilletera}
                onChange={(e) => setTelefonoBilletera(e.target.value)}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#1f2937', color: '#fff' }}
              />
            </div>
          )}
        </div>

        <div>
          <button
            onClick={manejarPago}
            disabled={procesando || carrito.length === 0}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: procesando ? '#475569' : '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: procesando || carrito.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {procesando ? 'PROCESANDO...' : 'PAGAR AHORA'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px', fontWeight: 'bold', color: mensajeEstado.includes('Aprobado') ? '#4ade80' : '#9ca3af' }}>
            {mensajeEstado}
          </div>
        </div>
      </div>
    </div>
  );
}
