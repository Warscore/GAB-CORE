import React, { useState } from 'react';

export default function Pasarela({ carrito, usuario, API_URL, alCompletarPago }) {
  const [medioPago, setMedioPago] = useState('PSE');
  const [bancoSeleccionado, setBancoSeleccionado] = useState('');
  const [datosTarjeta, setDatosTarjeta] = useState({ numero: '', fecha: '', cvc: '' });
  const [billeteraTipo, setBilleteraTipo] = useState('Nequi');
  const [telefonoBilletera, setTelefonoBilletera] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState('Pendiente');

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

      setMensajeEstado('¡Aprobado y guardado en Supabase!');
      setTimeout(() => {
        setProcesando(false);
        if (alCompletarPago) alCompletarPago();
      }, 1500);

    } catch (error) {
      setMensajeEstado('Error al procesar el pago.');
      setProcesando(false);
    }
  };

  return (
    <div className="cd" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '400px' }}>
      <div>
        <h2 className="t">Pasarela de Pagos</h2>
        
        <label className="l">Medio de Pago</label>
        <div className="seg" style={{ marginBottom: '20px' }}>
          {['PSE', 'Tarjeta', 'Billetera'].map((tipo) => (
            <button
              key={tipo}
              className={medioPago === tipo ? 'on' : ''}
              onClick={() => setMedioPago(tipo)}
            >
              {tipo}
            </button>
          ))}
        </div>

        {medioPago === 'PSE' && (
          <div style={{ marginBottom: '20px' }}>
            <label className="l">Seleccionar Banco</label>
            <select
              className="f"
              value={bancoSeleccionado}
              onChange={(e) => setBancoSeleccionado(e.target.value)}
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
            <label className="l">Datos de Tarjeta</label>
            <input
              className="f"
              type="text"
              placeholder="Número de Tarjeta"
              value={datosTarjeta.numero}
              onChange={(e) => setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="f"
                type="text"
                placeholder="MM/AA"
                value={datosTarjeta.fecha}
                onChange={(e) => setDatosTarjeta({ ...datosTarjeta, fecha: e.target.value })}
              />
              <input
                className="f"
                type="password"
                placeholder="CVC"
                maxLength="4"
                value={datosTarjeta.cvc}
                onChange={(e) => setDatosTarjeta({ ...datosTarjeta, cvc: e.target.value })}
              />
            </div>
          </div>
        )}

        {medioPago === 'Billetera' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <label className="l">Billetera Digital</label>
            <select
              className="f"
              value={billeteraTipo}
              onChange={(e) => setBilleteraTipo(e.target.value)}
            >
              <option value="Nequi">Nequi</option>
              <option value="Daviplata">Daviplata</option>
              <option value="Dale!">Dale!</option>
              <option value="Movii">Movii</option>
            </select>
            <input
              className="f"
              type="tel"
              placeholder="Número de celular registrado"
              value={telefonoBilletera}
              onChange={(e) => setTelefonoBilletera(e.target.value)}
            />
          </div>
        )}
      </div>

      <div>
        <button
          className="bt ac w"
          onClick={manejarPago}
          disabled={procesando || carrito.length === 0}
        >
          {procesando ? 'PROCESANDO...' : 'PAGAR AHORA'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '16px', fontWeight: 'bold', color: mensajeEstado.includes('Aprobado') ? '#4ade80' : 'var(--mu)' }}>
          {mensajeEstado}
        </div>
      </div>
    </div>
  );
}
