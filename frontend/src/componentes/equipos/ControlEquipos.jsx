import React from 'react';

export default function ControlEquipos() {
    return (
        <div className="cd">
            <h2>Control de Equipos y Mantenimiento</h2>
            <p>Gestión de series, estados y mantenimientos preventivos corporativos[cite: 7].</p>
            <table style={{width: '100%', marginTop: '15px', borderCollapse: 'collapse'}}>
                <thead>
                    <tr style={{borderBottom: '1px solid var(--bd)', textAlign: 'left'}}>
                        <th style={{padding: '8px'}}>Serial</th>
                        <th style={{padding: '8px'}}>Equipo</th>
                        <th style={{padding: '8px'}}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{borderBottom: '1px solid var(--bd)'}}>
                        <td style={{padding: '8px'}}>SN-0012</td>
                        <td style={{padding: '8px'}}>Portátil Pro 14</td>
                        <td style={{padding: '8px', color: 'var(--ok)'}}>Operativo</td>
                    </tr>
                    <tr>
                        <td style={{padding: '8px'}}>SN-0027</td>
                        <td style={{padding: '8px'}}>Servidor Torre</td>
                        <td style={{padding: '8px', color: 'var(--wa)'}}>Mantenimiento</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
