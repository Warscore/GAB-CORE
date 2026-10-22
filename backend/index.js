const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Conexión a la base de datos Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Error inesperado en PostgreSQL/Supabase:', err);
});

// Ruta de diagnóstico en la raíz
app.get('/', async (req, res) => {
  try {
    const dbTest = await pool.query('SELECT NOW()');
    res.json({ status: 'OK', mensaje: 'Backend activo y conectado a Supabase', hora: dbTest.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});

// INICIO DE SESIÓN CON MUESTRA DETALLADA DE ERROR
app.post('/api/clientes/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const query = `
      SELECT id, tipo_documento, numero_documento, nombre_razon_social, correo, telefono, ciudad, rol 
      FROM clientes 
      WHERE LOWER(correo) = LOWER($1) AND contrasena_hash = $2;
    `;
    const result = await pool.query(query, [correo.trim(), contrasena]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error en login BD:', err);
    // Devuelve el mensaje exacto de Supabase a la pantalla
    res.status(500).json({ error: 'Fallo BD: ' + err.message });
  }
});

// REGISTRO DE CLIENTES
app.post('/api/clientes/registro', async (req, res) => {
  const { tipo_documento, numero_documento, nombre_razon_social, correo, telefono, ciudad, contrasena } = req.body;
  try {
    const query = `
      INSERT INTO clientes (tipo_documento, numero_documento, nombre_razon_social, correo, telefono, ciudad, contrasena_hash, rol)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'cliente')
      RETURNING id, tipo_documento, numero_documento, nombre_razon_social, correo, telefono, ciudad, rol;
    `;
    const values = [tipo_documento, numero_documento, nombre_razon_social, correo.toLowerCase(), telefono, ciudad, contrasena];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Error en registro: ' + err.message });
  }
});

// CONSULTA DE PRODUCTOS
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos ORDER BY id ASC;');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: LISTAR CLIENTES
app.get('/api/admin/clientes', async (req, res) => {
  try {
    const result = await pool.query("SELECT id, tipo_documento, numero_documento, nombre_razon_social, correo, telefono, ciudad, fecha_registro FROM clientes WHERE rol = 'cliente' ORDER BY id DESC;");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REGISTRAR ÓRDENES
app.post('/api/ordenes', async (req, res) => {
  const { cliente_id, total, medio_pago, items } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const ordenRes = await client.query(
      "INSERT INTO ordenes (cliente_id, total, estado_pago, medio_pago) VALUES ($1, $2, 'Aprobado', $3) RETURNING *;",
      [cliente_id, total, medio_pago]
    );

    for (const item of items) {
      const serialUnico = 'SN-' + Math.floor(100000 + Math.random() * 900000);
      await client.query(
        "INSERT INTO equipos (cliente_id, serial, nombre_equipo, estado, proximo_mantenimiento) VALUES ($1, $2, $3, 'Operativo', 'Mantenimiento preventivo en 6 meses');",
        [cliente_id, serialUnico, item.nombre]
      );
    }

    await client.query('COMMIT');
    res.status(201).json(ordenRes.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ADMIN: HISTORIAL DE VENTAS
app.get('/api/admin/ordenes', async (req, res) => {
  try {
    const query = `
      SELECT o.id, o.total, o.estado_pago, o.medio_pago, o.fecha_orden, c.nombre_razon_social, c.correo
      FROM ordenes o
      JOIN clientes c ON o.cliente_id = c.id
      ORDER BY o.id DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TICKETS DE SOPORTE
app.post('/api/tickets', async (req, res) => {
  const { cliente_id, asunto, categoria, prioridad, descripcion } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tickets_soporte (cliente_id, asunto, categoria, prioridad, descripcion, estado) VALUES ($1, $2, $3, $4, $5, 'Abierto') RETURNING *;",
      [cliente_id, asunto, categoria, prioridad, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tickets', async (req, res) => {
  const { cliente_id, esAdmin } = req.query;
  try {
    let query = "SELECT t.*, c.nombre_razon_social AS cliente, c.correo FROM tickets_soporte t JOIN clientes c ON t.cliente_id = c.id";
    if (esAdmin !== 'true') {
      const result = await pool.query(query + " WHERE t.cliente_id = $1 ORDER BY t.id DESC;", [parseInt(cliente_id)]);
      return res.json(result.rows);
    }
    const result = await pool.query(query + " ORDER BY t.id DESC;");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tickets/:id/resolver', async (req, res) => {
  try {
    await pool.query("UPDATE tickets_soporte SET estado = 'Resuelto' WHERE id = $1;", [req.params.id]);
    res.json({ mensaje: 'Ticket resuelto correctamente.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EQUIPOS
app.get('/api/equipos', async (req, res) => {
  const { cliente_id, esAdmin } = req.query;
  try {
    let query = "SELECT e.*, c.correo AS cliente_correo FROM equipos e JOIN clientes c ON e.cliente_id = c.id";
    if (esAdmin !== 'true') {
      const result = await pool.query(query + " WHERE e.cliente_id = $1;", [parseInt(cliente_id)]);
      return res.json(result.rows);
    }
    const result = await pool.query(query + " ORDER BY e.id DESC;");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor en puerto ${PORT}`));
