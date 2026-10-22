import React, { useState } from 'react';

export default function PasarelaSimulada({ carrito, vaciarCarrito, usuario, alCompletarPago }) {
  const [medioPago, setMedioPago] = useState('PSE');
  const [bancoSeleccionado, setBancoSeleccionado] = useState('');
  
  // Datos para Tarjeta de Crédito/Débito
  const [datosTarjeta, setDatosTarjeta] = useState({ numero: '', fecha: '', cvc: '', nombre: '' });
  
  // Datos para Billetera Digital
  const [billetera, setBilletera] = useState('Nequi');
  const [telefonoBilletera, setTelefonoBilletera] = useState('');

  const [procesando, setProcesando] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState('Pendiente');

  // Lista ampliada de entidades bancarias PSE en Colombia
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
    'Nu Colombia (Cuenta Clic)',
    'RappiPay',
    'Banco Agrario de Colombia',
    'Banco Pichincha'
  ];

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
      alert('Por favor completa los datos de la tarjeta.');
      return;
    }

    if (medioPago === 'Billetera' && !telefonoBilletera) {
      alert('Por favor ingresa el número de teléfono vinculado a tu billetera.');
      return;
    }

    setProcesando(true);
    setMensajeEstado('Procesando pago con la entidad...');

    try {
      const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://gab-core-backend.onrender.com/api';

      const respuesta = await fetch(`${apiUrl}/ordenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id: usuario.id,
          total: total,
          medio_pago: medioPago === 'PSE' ? `PSE (${bancoSeleccionado})` : medioPago === 'Billetera' ? `${billetera} (${telefonoBilletera})` : 'Tarjeta de Crédito/Débito',
          items: carrito
        })
      });

      if (!respuesta.ok) {
        throw new Error('Error al registrar la transacción.');
      }

      setMensajeEstado('¡Pago Aprobado con Éxito!');
      setTimeout(() => {
        vaciarCarrito();
        setMensajeEstado('Pendiente');
        setProcesando(false);
        if (alCompletarPago) alCompletarPago();
      }, 1500);

    } catch (error) {
      setMensajeEstado('Error al procesar el pago. Inténtalo de nuevo.');
      setProcesando(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '20px', textTransform: 'uppercase' }}>
          Pasarela de Pagos
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
            Medio de Pago
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['PSE', 'Tarjeta', 'Billetera'].map((tipo) => (
              <button
                key={tipo}
                onClick={() => setMedioPago(tipo)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: medioPago === tipo ? '#0284c7' : '#f8fafc',
                  color: medioPago === tipo ? '#ffffff' : '#334155',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        {/* Formulario Dinámico según el Medio de Pago */}
        {medioPago === 'PSE' && (
          <div style={{ marginBottom: '20px' }}>
            <select
              value={bancoSeleccionado}
              onChange={(e) => setBancoSeleccionado(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#334155',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Número de Tarjeta"
              value={datosTarjeta.numero}
              onChange={(e) => setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="MM/AA"
                value={datosTarjeta.fecha}
                onChange={(e) => setDatosTarjeta({ ...datosTarjeta, fecha: e.target.value })}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}
              />
              <input
                type="password"
                placeholder="CVC"
                maxLength="4"
                value={datosTarjeta.cvc}
                onChange={(e) => setDatosTarjeta({ ...datosTarjeta, cvc: e.target.value })}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}
              />
            </div>
          </div>
        )}

        {medioPago === 'Billetera' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <select
              value={billetera}
              onChange={(e) => setBilletera(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}
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
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}
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
            backgroundColor: procesando ? '#94a3b8' : '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '30px',
            fontWeight: '900',
            fontSize: '15px',
            cursor: procesando || carrito.length === 0 ? 'not-allowed' : 'pointer',
            letterSpacing: '0.5px'
          }}
        >
          {procesando ? 'PROCESANDO...' : 'PAGAR AHORA'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px', fontWeight: 'bold', color: mensajeEstado.includes('Éxito') ? '#16a34a' : '#64748b' }}>
          {mensajeEstado}
        </div>
      </div>
    </div>
  );
}
