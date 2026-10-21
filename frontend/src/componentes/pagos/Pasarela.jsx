import React, { useState } from 'react';

export default function Pasarela({ carrito, alModificarCantidad, alQuitarItem, alVaciarCarrito }) {
  const [medio, setMedio] = useState('PSE');
  const [banco, setBanco] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [procesando, setProcesando] = useState(false);

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  const procesarPago = () => {
    if (carrito.length === 0) return;
    if (medio === 'PSE' && !banco) {
      alert('Seleccione un banco para continuar con PSE.');
      return;
    }
    setProcesando(true);
    setEstado('Conectando con la entidad financiera...');

    setTimeout(() => {
      setEstado('Validando autorización...');
    }, 1200);

    setTimeout(() => {
      setEstado('Aprobado. Comprobante enviado por correo electrónico.');
      setProcesando(false);
      alVaciarCarrito();
    }, 2800);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '20px' }}>
      <div className="cd">
        <h2 className="t">Resumen del Pedido</h2>
        {carrito.length === 0 ? (
          <p className="mu">El carrito está vacío. Agrega productos desde el Catálogo.</p>
        ) : (
          <div>
            {carrito.map(item => (
              <div key={item.id} className="cart-line">
                <div>
                  <strong>{item.nombre}</strong>
                  <div style={{ fontSize: '.8rem', color: 'var(--mu)' }}>${item.precio.toLocaleString('es-CO')} c/u</div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                    <button className="bt" style={{ height: '26px', padding: '0 10px', fontSize: '.75rem' }} onClick={() => alModificarCantidad(item.id, item.cantidad - 1)}>-</button>
                    <span>{item.cantidad}</span>
                    <button className="bt" style={{ height: '26px', padding: '0 10px', fontSize: '.75rem' }} onClick={() => alModificarCantidad(item.id, item.cantidad + 1)}>+</button>
                    <button className="bt er" style={{ height: '26px', padding: '0 10px', fontSize: '.75rem', marginLeft: '10px' }} onClick={() => alQuitarItem(item.id)}>Quitar</button>
                  </div>
                </div>
                <div style={{ fontWeight: 800 }}>${(item.precio * item.cantidad).toLocaleString('es-CO')}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>Total a pagar:</span>
              <span className="ac">${total.toLocaleString('es-CO')} COP</span>
            </div>
            <button className="bt er w" style={{ marginTop: '14px' }} onClick={alVaciarCarrito}>Vaciar Carrito</button>
          </div>
        )}
      </div>

      <div className="cd">
        <h2 className="t">Pasarela de Pagos (Sandbox)</h2>
        <span className="l">Seleccione medio de pago</span>
        <div className="seg">
          {['PSE', 'Tarjeta', 'Billetera'].map(m => (
            <button key={m} type="button" className={medio === m ? 'on' : ''} onClick={() => setMedio(m)}>{m === 'PSE' ? 'PSE / Débito' : m === 'Tarjeta' ? 'Tarjeta Crédito' : 'Nequi / Daviplata'}</button>
          ))}
        </div>

        {medio === 'PSE' && (
          <div>
            <label className="l">Entidad Financiera</label>
            <select className="f" value={banco} onChange={e => setBanco(e.target.value)}>
              <option value="">-- Seleccione Banco --</option>
              <option value="Bancolombia">Bancolombia</option>
              <option value="Davivienda">Davivienda</option>
              <option value="Banco de Bogotá">Banco de Bogotá</option>
              <option value="Nequi">Nequi</option>
            </select>
          </div>
        )}

        {medio === 'Tarjeta' && (
          <div>
            <input className="f" placeholder="Nombre del titular" />
            <input className="f" placeholder="Número de tarjeta ficticio" maxLength="19" />
          </div>
        )}

        <button className="bt ac w" onClick={procesarPago} disabled={procesando || carrito.length === 0}>
          {procesando ? 'Procesando...' : 'Pagar Ahora'}
        </button>

        <div style={{ marginTop: '20px', padding: '14px', background: 'var(--bg)', borderRadius: '12px', textAlign: 'center' }}>
          <small className="mu">ESTADO DE LA TRANSACCIÓN</small>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', marginTop: '4px' }}>{estado}</div>
        </div>
      </div>
    </div>
  );
}
