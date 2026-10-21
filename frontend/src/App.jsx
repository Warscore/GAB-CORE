import React, { useState } from 'react';
import CatalogoProductos from './componentes/productos/CatalogoProductos';
import FormularioRegistro from './componentes/clientes/FormularioRegistro';
import PasarelaSimulada from './componentes/pagos/PasarelaSimulada';
import FormularioAyuda from './componentes/ayuda/FormularioAyuda';
import ControlEquipos from './componentes/equipos/ControlEquipos';

export default function App() {
    const [seccion, setSeccion] = useState('catalogo');

    return (
        <div>
            <header>
                <span className="logo"><b>G</b>AP<small>.core</small></span>
                <nav style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                    <button className="bt" onClick={() => setSeccion('catalogo')}>Catálogo</button>
                    <button className="bt" onClick={() => setSeccion('registro')}>Registro</button>
                    <button className="bt" onClick={() => setSeccion('pagos')}>Pagos</button>
                    <button className="bt" onClick={() => setSeccion('ayuda')}>Ayuda</button>
                    <button className="bt" onClick={() => setSeccion('equipos')}>Equipos</button>
                </nav>
            </header>
            <main style={{padding: '20px', maxWidth: '1100px', margin: '0 auto'}}>
                {seccion === 'catalogo' && <CatalogoProductos />}
                {seccion === 'registro' && <FormularioRegistro />}
                {seccion === 'pagos' && <PasarelaSimulada />}
                {seccion === 'ayuda' && <FormularioAyuda />}
                {seccion === 'equipos' && <ControlEquipos />}
            </main>
        </div>
    );
}
