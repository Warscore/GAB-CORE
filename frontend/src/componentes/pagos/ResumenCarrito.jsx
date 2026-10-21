import React, { useState } from 'react';

export default function ResumenCarrito({ carrito, alVaciar, alProcesarPago }) {
  const [medio, setMedio] = useState('PSE');
  const [banco, setBanco] = useState('');
  const [tarjeta, setTarjeta] = useState({ nombre: '', numero: '', exp: '', cvv: '' });
  const [estadoPago, setEstadoPago] = useState('Pendiente');
  const [procesando, setProcesando] = useState(false);

  const total = carrito.reduce((sum, i) => sum + (i.precio * i.cantidad), 0);

  const pagar = () => {
    if (total === 0) return;
    if (medio === 'PSE' && !banco) {
      alert('Por favor selecciona tu banco.');
      return;
    }
    setProcesando(true);
    setEstadoPago('Conectando con pasarela...');
    
    setTimeout(() => {
      setEstadoPago('Verificando fondos...');
    }, 1200);

    setTimeout(() => {
      setEstadoPago('Aprobado. Comprobante enviado al correo.');
      setProcesando(false);
      alProcesarPago();
    }, 2800);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div className="cd">
        <h2 className="t">Resumen del Pedido</h2>
        {carrito.length === 0 ? (
          <p className="mu">El carrito está vacío. Agrega productos en el Catálogo.</p>
        ) : (
          carrito.map((item, idx) => (
            <div key={idx} className="cart-line">
              <div>
                <strong>{item.nombre}</strong> (x{item.cantidad})
              </div>
              <div>${(item.precio * item.cantidad).toLocaleString('es-CO')}</div>
            </div>
          ))
        )}
        <div style={{ marginTop: '16px', fontSize: '1.2rem', fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
          <span>Total:</span>
          <span className="ac">${total.toLocaleString('es-CO')} COP</span>
        </div>
        {carrito.length > 0 && (
          <button className="bt er" style={{ marginTop: '12px', width: '100%' }} onClick={alVaciar}>
            Vaciar Carrito
          </button>
        )}
      </div>

      <div className="cd">
        <h2 className="t">Pasarela Simulada</h2>
        <span className="l">Selecciona Medio de Pago</span>
        <div className="seg">
          <button className={medio === 'PSE' ? 'on' : ''} onClick={() => setMedio('PSE')}>PSE / Débito</button>
          <button className={medio === 'Tarjeta' ? 'on' : ''} onClick={() => setMedio('Tarjeta')}>Tarjeta Crédito</button>
          <button className={medio === 'Billetera' ? 'on' : ''} onClick={() => setMedio('Billetera')}>Nequi / Daviplata</button>
        </div>

        {medio === 'PSE' && (
          <div>
            <label className="l">Banco</label>
            <select className="f" value={banco} onChange={e => setBanco(e.target.value)}>
              <option value="">-- Selecciona Banco --</option>
              <option value="Bancolombia">Bancolombia</option>
              <option value="Davivienda">Davivienda</option>
              <option value="Banco de Bogotá">Banco de Bogotá</option>
              <option value="Nequi">Nequi</option>
            </select>
          </div>
        )}

        {medio === 'Tarjeta' && (
          <div>
            <input className="f" placeholder="Nombre en la tarjeta" value={tarjeta.nombre} onChange={e => setTarjeta({...tarjeta, nombre: e.target.value})} />
            <input className="f" placeholder="Número de tarjeta ficticio" value={tarjeta.numero} onChange={e => setTarjeta({...tarjeta, numero: e.target.value})} />
          </div>
        )}

        <button className="bt ac w" onClick={pagar} disabled={procesando || total === 0}>
          {procesando ? 'Procesando...' : 'Pagar Ahora'}
        </button>

        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg)', borderRadius: '10px', textAlign: 'center' }}>
          <small className="mu">ESTADO DE TRANSACCIÓN</small>
          <div style={{ fontWeight: 800, marginTop: '4px' }}>{estadoPago}</div>
        </div>
      </div>
    </div>
  );
}
