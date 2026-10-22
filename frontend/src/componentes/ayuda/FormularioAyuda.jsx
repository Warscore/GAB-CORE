import React, { useState } from 'react';

export default function FormularioAyuda() {
    const [asunto, setAsunto] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const enviarTicket = (e) => {
        e.preventDefault();
        alert("Ticket de soporte creado exitosamente con SLA asignado[cite: 7].");
        setAsunto('');
        setDescripcion('');
    };

    return (
        <div className="cd">
            <h2>Mesa de Ayuda - Nuevo Ticket</h2>
            <form onSubmit={enviarTicket}>
                <label>Asunto</label>
                <input className="f" value={asunto} onChange={(e) => setAsunto(e.target.value)} placeholder="Ej. El equipo no enciende" required />
                <label>Descripción del problema</label>
                <textarea className="f" rows="3" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Detalla el fallo técnico..." required />
                <button type="submit" className="bt ac">Enviar Ticket</button>
            </form>
        </div>
    );
}
