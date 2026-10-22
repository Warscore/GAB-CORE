import React, { useState } from 'react';
import { API_URL } from '../../config';

export default function FormularioAyuda({ usuario, alCrear }) {
  const [asunto, setAsunto] = useState('');
  const [categoria, setCategoria] = useState('Hardware');
  const [prioridad, setPrioridad] = useState('Media');
  const [descripcion, setDescripcion] = useState('');

  const crearTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: usuario.id, asunto, categoria, prioridad, descripcion })
      });
      if (res.ok) {
        setAsunto('');
        setDescripcion('');
        alCrear();
        alert('Ticket creado con éxito.');
      }
    } catch (err) {
      alert('Error al crear ticket.');
    }
  };

  return (
    <div className="cd">
      <h2 className="t">Nuevo Ticket de Soporte</h2>
      <form onSubmit={crearTicket}>
        <label className="l">Asunto</label>
        <input className="f" value={asunto} onChange={e => setAsunto(e.target.value)} required />
        <label className="l">Categoría</label>
        <select className="f" value={categoria} onChange={e => setCategoria(e.target.value)}>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
          <option value="Pagos">Pagos</option>
        </select>
        <label className="l">Prioridad</label>
        <select className="f" value={prioridad} onChange={e => setPrioridad(e.target.value)}>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>
        <label className="l">Descripción</label>
        <textarea className="f" rows="3" value={descripcion} onChange={e => setDescripcion(e.target.value)} required></textarea>
        <button type="submit" className="bt ac w">Enviar Ticket</button>
      </form>
    </div>
  );
}
