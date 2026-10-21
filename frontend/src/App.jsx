import React, { useState } from 'react';
import FormularioRegistro from './componentes/clientes/FormularioRegistro';
import PasarelaSimulada from './componentes/pagos/PasarelaSimulada';

export default function App() {
    const [seccionActiva, setSeccionActiva] = useState('catalogo');

    return (
        <div>
            <header>
                <span className="logo"><b>G</b>AP<small>.core</small></span>
                <nav style={{display: 'flex', gap: '10px'}}>
                    <button className="bt" onClick={() => setSeccionActiva('catalogo')}>Catálogo</button>
                    <button className="bt" onClick={() => setSeccionActiva('registro')}>Registro</button>
                    <button className="bt" onClick={() => setSeccionActiva('pagos')}>Pagos</button>
                    <button className="bt" onClick={() => setSeccionActiva('ayuda')}>Mesa de Ayuda</button>
                    <button className="bt" onClick={() => setSeccionActiva('equipos')}>Equipos</button>
                </nav>
            </header>

            <main>
                {seccionActiva === 'catalogo' && (
                    <div className="cd">
                        <h2>Catálogo de Productos y Ofertas GAP Core</h2>
                        <p>Explora computadores, redes e infraestructura tecnológica para tu empresa[cite: 6, 7].</p>
                    </div>
                )}
                {seccionActiva === 'registro' && <FormularioRegistro />}
                {seccionActiva === 'pagos' && <PasarelaSimulada />}
                {seccionActiva === 'ayuda' && (
                    <div className="cd">
                        <h2>Mesa de Ayuda - Tickets de Soporte</h2>
                        <p>Crea tickets con categoría, prioridad y adjuntos[cite: 7].</p>
                    </div>
                )}
                {seccionActiva === 'equipos' && (
                    <div className="cd">
                        <h2>Control de Equipos y Mantenimiento</h2>
                        <p>Gestión de series, estados y mantenimientos preventivos[cite: 7].</p>
                    </div>
                )}
            </main>
        </div>
    );
}
