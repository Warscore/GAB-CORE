import React from 'react';

export default function CatalogoProductos() {
    return (
        <div className="cd">
            <h2>Catálogo y Ofertas GAP Core</h2>
            <p>Explora equipos de cómputo, redes e infraestructura tecnológica para tu empresa[cite: 6, 7].</p>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginTop: '15px'}}>
                <div style={{background: 'var(--bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--bd)'}}>
                    <h3>Portátil Pro 14</h3>
                    <p style={{color: 'var(--ac)', fontWeight: 'bold'}}>$3.200.000 COP</p>
                    <button className="bt ac" style={{width: '100%', marginTop: '10px'}}>Agregar</button>
                </div>
                <div style={{background: 'var(--bg)', padding: '15px', borderRadius: '8px', border: '1px solid var(--bd)'}}>
                    <h3>Router WiFi 6</h3>
                    <p style={{color: 'var(--ac)', fontWeight: 'bold'}}>$280.000 COP</p>
                    <button className="bt ac" style={{width: '100%', marginTop: '10px'}}>Agregar</button>
                </div>
            </div>
        </div>
    );
}
