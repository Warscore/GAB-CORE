import React, { useState } from 'react';

export default function MesaAyuda({ usuario, tickets = [], alCrearTicket, alActualizarEstado }) {
  const [asunto, setAsunto] = useState('');
  const [categoria, setCategoria] = useState('Hardware');
  const [prioridad, setPrioridad] = useState('Media');
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviarTicket = async (evento) => {
    evento.preventDefault();
    if (!asunto.trim() || !descripcion.trim() || enviando) return;

    setEnviando(true);
    try {
      const creado = await alCrearTicket({
        asunto: asunto.trim(),
        categoria,
        prioridad,
        descripcion: descripcion.trim(),
        cliente: usuario.nombre_razon_social || usuario.nombre || '',
        correo: usuario.correo,
      });

      if (creado) {
        setAsunto('');
        setCategoria('Hardware');
        setPrioridad('Media');
        setDescripcion('');
      }
    } finally {
      setEnviando(false);
    }
  };

  const listaVisible = usuario.rol === 'admin'
    ? tickets
    : tickets.filter((ticket) => ticket.correo === usuario.correo);

  return (
    <div className="ayuda-layout">
      <section className="cd">
        <h2 className="t">Nuevo Ticket de Soporte</h2>
        <form onSubmit={enviarTicket}>
          <label className="l" htmlFor="ticket-asunto">Asunto</label>
          <input
            id="ticket-asunto"
            className="f"
            value={asunto}
            onChange={(evento) => setAsunto(evento.target.value)}
            placeholder="Ej. El equipo no enciende"
            maxLength={150}
            required
          />

          <span className="l">Categoría</span>
          <div className="seg" role="group" aria-label="Categoría del ticket">
            {['Hardware', 'Software', 'Pagos', 'Mantenimiento'].map((opcion) => (
              <button
                key={opcion}
                type="button"
                className={categoria === opcion ? 'on' : ''}
                aria-pressed={categoria === opcion}
                onClick={() => setCategoria(opcion)}
              >
                {opcion}
              </button>
            ))}
          </div>

          <span className="l">Prioridad</span>
          <div className="seg" role="group" aria-label="Prioridad del ticket">
            {['Baja', 'Media', 'Alta'].map((opcion) => (
              <button
                key={opcion}
                type="button"
                className={prioridad === opcion ? 'on' : ''}
                aria-pressed={prioridad === opcion}
                onClick={() => setPrioridad(opcion)}
              >
                {opcion}
              </button>
            ))}
          </div>

          <label className="l" htmlFor="ticket-descripcion">Descripción del inconveniente</label>
          <textarea
            id="ticket-descripcion"
            className="f"
            rows="4"
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
            placeholder="Describe detalladamente el problema técnico..."
            required
          />

          <button type="submit" className="bt ac w" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar ticket'}
          </button>
        </form>
      </section>

      <section className="cd">
        <h2 className="t">
          {usuario.rol === 'admin' ? 'Mesa de Ayuda - Panel Administrador' : 'Mis Tickets Registrados'}
        </h2>

        {listaVisible.length === 0 ? (
          <p className="mu">No hay tickets para mostrar en este momento.</p>
        ) : (
          listaVisible.map((ticket) => (
            <article key={ticket.id} className="ticket-item">
              <div className="ticket-cabecera">
                <strong>#{ticket.id} - {ticket.asunto}</strong>
                <span className={`b ${ticket.prioridad === 'Alta' ? 'er' : ticket.prioridad === 'Media' ? 'wa' : 'ac'}`}>
                  {ticket.prioridad}
                </span>
              </div>
              <p className="ticket-descripcion">{ticket.descripcion}</p>
              <div className="ticket-pie">
                <span>
                  {usuario.rol === 'admin'
                    ? `Cliente: ${ticket.cliente || ticket.nombre_razon_social || 'Sin nombre'} (${ticket.correo || 'Sin correo'})`
                    : `Categoría: ${ticket.categoria}`}
                </span>
                <div className="ticket-acciones">
                  <span className={`b ${ticket.estado === 'Resuelto' ? 'ok' : 'ac'}`}>{ticket.estado}</span>
                  {usuario.rol === 'admin' && ticket.estado !== 'Resuelto' && (
                    <button
                      type="button"
                      className="bt ac boton-resolver"
                      onClick={() => alActualizarEstado(ticket.id)}
                    >
                      Resolver
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
