import React, { useState } from 'react';
import { API_URL } from '../../servicios/api';
import ResumenCarrito from './ResumenCarrito';

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
      const respuesta = await fetch(`${API_URL}/ordenes`, {
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

      setMensajeEstado('Pedido registrado en modo demostración; no hubo cobro real.');
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
    <div className="pagos-layout">
      <ResumenCarrito
        carrito={carrito}
        vaciarCarrito={vaciarCarrito}
        actualizarCantidad={actualizarCantidad}
        eliminarDelCarrito={eliminarDelCarrito}
      />

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
          <p style={{ margin: '-8px 0 18px', padding: '10px 12px', borderRadius: '8px', backgroundColor: '#3f2d12', color: '#fde68a', fontSize: '12px', lineHeight: 1.5 }}>
            Modo demostración: esta pantalla registra el pedido, pero no realiza cobros bancarios reales.
          </p>

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
