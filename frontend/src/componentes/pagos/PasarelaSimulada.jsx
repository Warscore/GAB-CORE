import React, { useState } from 'react';

export default function PasarelaSimulada() {
    const [estadoPago, setEstadoPago] = useState("Sin iniciar");
    const [medio, setMedio] = useState("PSE");

    const simularPago = () => {
        setEstadoPago("Pendiente en pasarela...");
        setTimeout(() => {
            setEstadoPago("Procesando con la entidad financiera...");
        }, 1500);
        setTimeout(() => {
            setEstadoPago("Aprobado exitosamente. Comprobante enviado por correo.");
        }, 3200);
    };

    return (
        <div className="cd">
            <h2>Pasarela de Pagos en Tiempo Real (Sandbox)</h2>
            <p>Total a pagar: <b>$3.572.000 COP</b></p>
            
            <label>Seleccione medio de pago</label>
            <select className="f" value={medio} onChange={(e) => setMedio(e.target.value)}>
                <option value="PSE">PSE (Débito bancario)</option>
                <option value="Tarjeta">Tarjeta de Crédito / Débito</option>
                <option value="Billetera">Billetera Digital</option>
            </select>

            <button className="bt ac" onClick={simularPago}>Pagar ahora</button>
            
            <div style={{marginTop: '20px', padding: '15px', background: '#e2e6ed', borderRadius: '8px'}}>
                <small>ESTADO DE LA TRANSACCIÓN:</small>
                <div style={{fontSize: '1.1rem', fontWeight: 'bold', marginTop: '5px'}}>{estadoPago}</div>
            </div>
        </div>
    );
}
