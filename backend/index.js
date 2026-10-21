const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: 'postgresql://usuario:contrasena@tu-servidor-postgres.com:5432/gapcore'
});

app.get('/api/estado', (req, res) => {
    res.json({ mensaje: "Servidor GAP Core funcionando correctamente" });
});

app.get('/api/productos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM productos');
        res.json(resultado.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/clientes/registro', async (req, res) => {
    const { tipo_documento, numero_documento, nombre_razon_social, correo, telefono, ciudad, contrasena } = req.body;
    try {
        const nuevoCliente = await pool.query(
            'INSERT INTO clientes (tipo_documento, numero_documento, nombre_razon_social, correo, telefono, ciudad, contrasena_hash) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [tipo_documento, numero_documento, nombre_razon_social, correo, telefono, ciudad, contrasena]
        );
        res.json({ mensaje: "Cliente registrado con éxito", cliente: nuevoCliente.rows[0] });
    } catch (err) {
        res.status(400).json({ error: "El correo o documento ya se encuentran registrados." });
    }
});

app.post('/api/pagos/procesar', async (req, res) => {
    const { orden_id, medio_pago } = req.body;

    setTimeout(() => {
        res.json({
            estado: "Aprobado",
            mensaje: "Pago procesado exitosamente a través de " + medio_pago,
            comprobante_enviado: true
        });
    }, 2000);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
