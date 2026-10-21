import React, { useState } from 'react';

export default function FormularioRegistro() {
    const [form, setForm] = useState({
        tipo_documento: 'Cédula de ciudadanía',
        numero_documento: '',
        nombre_razon_social: '',
        correo: '',
        telefono: '',
        ciudad: '',
        contrasena: ''
    });
    const [mensaje, setMensaje] = useState('');

    const manejarCambio = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const enviarRegistro = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await fetch('http://localhost:3000/api/clientes/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const datos = await respuesta.json();
            if (respuesta.ok) {
                setMensaje("¡Cuenta creada con éxito! Revisa tu correo para verificarla.");
            } else {
                setMensaje("Error: " + datos.error);
            }
        } catch (error) {
            setMensaje("No se pudo conectar con el servidor.");
        }
    };

    return (
        <div className="cd">
            <h2>Crea tu cuenta - GAP Core</h2>
            <form onSubmit={enviarRegistro}>
                <label>Tipo de documento</label>
                <select name="tipo_documento" className="f" onChange={manejarCambio}>
                    <option>Cédula de ciudadanía</option>
                    <option>NIT</option>
                    <option>Cédula de extranjería</option>
                </select>

                <label>Número de documento</label>
                <input type="text" name="numero_documento" className="f" placeholder="1020304050" onChange={manejarCambio} required />

                <label>Nombre o Razón Social</label>
                <input type="text" name="nombre_razon_social" className="f" placeholder="Nombre completo o empresa" onChange={manejarCambio} required />

                <label>Correo electrónico</label>
                <input type="email" name="correo" className="f" placeholder="correo@ejemplo.com" onChange={manejarCambio} required />

                <label>Teléfono</label>
                <input type="text" name="telefono" className="f" placeholder="300 000 0000" onChange={manejarCambio} />

                <label>Ciudad</label>
                <input type="text" name="ciudad" className="f" placeholder="Bogotá / Soacha" onChange={manejarCambio} />

                <label>Contraseña</label>
                <input type="password" name="contrasena" className="f" placeholder="Mínimo 8 caracteres" onChange={manejarCambio} required />

                <p style={{fontSize: '0.85rem', color: '#6a7587'}}>Acepto el tratamiento de datos personales (Ley 1581 de 2012)</p>

                <button type="submit" className="bt ac">Registrarme</button>
            </form>
            {mensaje && <p style={{fontWeight: '700', marginTop: '12px'}}>{mensaje}</p>}
        </div>
    );
}
