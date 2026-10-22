import React, { useState } from 'react';
import { API_URL } from '../../config';

// Lista ampliada de bancos PSE en Colombia
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

export default function Pasarela({ usuario, carrito, alPagoExitoso }) {
  const [medioPago, setMedioPago] = useState('PSE');
  const [bancoSeleccionado, setBancoSeleccionado] = useState('');
  const [datosTarjeta, setDatosTarjeta] = useState({ numero: '', fecha: '', cvc: '' });
  const [billeteraTipo, setBilleteraTipo] = useState('Nequi');
  const [telefonoBilletera, setTelefonoBilletera] = useState('');
  const [estadoTransaccion, setEstadoTransaccion] = useState('Pendiente');

  const procesarPago = async () => {
    if (carrito.length === 0) return;

    if (medioPago === 'PSE' && !bancoSeleccionado) {
      alert('Por favor selecciona un banco para continuar con PSE.');
      return;
    }
    if (medioPago === 'Tarjeta' && (!datosTarjeta.numero || !datosTarjeta.fecha || !datosTarjeta.cvc)) {
      alert('Por favor completa todos los datos de la tarjeta.');
      return;
    }
    if (medioPago === 'Billetera' && !telefonoBilletera) {
      alert('Por favor ingresa el número de celular asociado a la billetera digital.');
      return;
    }

    const total = carrito.reduce((s, i) => s + (i.precio * i.cantidad), 0);
    setEstadoTransaccion('Conectando con la entidad financiera...');

    let descripcionMedio = medioPago;
    if (medioPago === 'PSE') descripcionMedio = `PSE (${bancoSeleccionado})`;
    if (medioPago === 'Tarjeta') descripcionMedio = 'Tarjeta de Crédito/Débito';
    if (medioPago === 'Billetera') descripcionMedio = `Billetera ${billeteraTipo} (${telefonoBilletera})`;

    try {
      const res = await fetch(`${API_URL}/ordenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: usuario.id, total, medio_pago: descripcionMedio, items: carrito })
      });
      if (res.ok) {
        setEstadoTransaccion('Aprobado. Guardado en Supabase.');
        alPagoExitoso();
      } else {
        setEstadoTransaccion('Error en la transacción.');
      }
    } catch (err) {
      setEstadoTransaccion('Error de red.');
    }
  };

  return (
    <div className="cd">
      <h2 className="t">Pasarela de Pagos</h2>
      <label className="l">Medio de Pago</label>
      <div className="seg">
        {['PSE', 'Tarjeta', 'Billetera'].map(m => (
          <button key={m} className={medioPago === m ? 'on' : ''} onClick={() => setMedioPago(m)}>{m}</button>
        ))}
      </div>

      {medioPago === 'PSE' && (
        <div style={{ marginTop: '12px' }}>
          <label className="l">Seleccionar Banco</label>
          <select className="f" value={bancoSeleccionado} onChange={e => setBancoSeleccionado(e.target.value)}>
            <option value="">-- Seleccionar Banco --</option>
            {bancosPSE.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      )}

      {medioPago === 'Tarjeta' && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="l">Datos de Tarjeta</label>
          <input className="f" type="text" placeholder="Número de Tarjeta" value={datosTarjeta.numero} onChange={e => setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <input className="f" type="text" placeholder="MM/AA" value={datosTarjeta.fecha} onChange={e => setDatosTarjeta({ ...datosTarjeta, fecha: e.target.value })} />
            <input className="f" type="password" placeholder="CVC" maxLength="4" value={datosTarjeta.cvc} onChange={e => setDatosTarjeta({ ...datosTarjeta, cvc: e.target.value })} />
          </div>
        </div>
      )}

      {medioPago === 'Billetera' && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className="l">Billetera Digital</label>
          <select className="f" value={billeteraTipo} onChange={e => setBilleteraTipo(e.target.value)}>
            <option value="Nequi">Nequi</option>
            <option value="Daviplata">Daviplata</option>
            <option value="Dale!">Dale!</option>
            <option value="Movii">Movii</option>
          </select>
          <input className="f" type="tel" placeholder="Número de Celular" value={telefonoBilletera} onChange={e => setTelefonoBilletera(e.target.value)} />
        </div>
      )}

      <button className="bt ac w" style={{ marginTop: '16px' }} onClick={procesarPago} disabled={carrito.length === 0}>Pagar Ahora</button>
      <div style={{ marginTop: '16px', textAlign: 'center', fontWeight: 800 }}>{estadoTransaccion}</div>
    </div>
  );
}
