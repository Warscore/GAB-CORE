const express = require('express');
const cors = require('cors');
const pool = require('../base-de-datos/conexion');

const app = express();
app.use(cors());
app.use(express.json());


app.post('/api/clientes/registro', async (req, res) => {
  const { tipo_documento, numero_documento, nombre_razon_social, correo, telefono, ciudad, contrasena } = req.body;
  try {
    const query = `
      INSERT INTO clientes (tipo_documento, numero_documento, nombre_razon_social, correo, telefono, ciudad, contrasena_hash, rol)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'cliente')
      RETURNING id, nombre_razon_social, correo, rol;
    `;
    const values = [tipo_documento, numero_documento, nombre_razon_social, correo.toLowerCase(), telefono, ciudad, contrasena];
    const nuevo = await pool.query(query, values);
    res.status(201).json(nuevo.rows[0]);
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(400).json({ error: 'El correo o número de documento ya se encuentra registrado en la base de datos.' });
  }
});


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
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.' });
  }
});


app.get('/api/admin/clientes', async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, tipo_documento, numero_documento, nombre_razon_social, correo, telefono, ciudad, fecha_registro FROM clientes WHERE rol = 'cliente' ORDER BY id DESC;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar los clientes.' });
  }
});



app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM productos ORDER BY id ASC;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el catálogo de productos.' });
  }
});



app.post('/api/ordenes', async (req, res) => {
  const { cliente_id, total, medio_pago, items } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');


    const ordenQuery = `
      INSERT INTO ordenes (cliente_id, total, estado_pago, medio_pago)
      VALUES ($1, $2, 'Aprobado', $3)
      RETURNING *;
    `;
    const ordenRes = await client.query(ordenQuery, [cliente_id, total, medio_pago]);
    const nuevaOrden = ordenRes.rows[0];


    for (const item of items) {
      const serialUnico = 'SN-' + Math.floor(100000 + Math.random() * 900000);
      const equipoQuery = `
        INSERT INTO equipos (cliente_id, serial, nombre_equipo, estado, proximo_mantenimiento)
        VALUES ($1, $2, $3, 'Operativo', 'Mantenimiento preventivo en 6 meses');
      `;
      await client.query(equipoQuery, [cliente_id, serialUnico, item.nombre]);
    }

    await client.query('COMMIT');
    res.status(201).json(nuevaOrden);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error procesando orden en BD:', err);
    res.status(500).json({ error: 'Error al procesar la orden en la base de datos.' });
  } finally {
    client.release();
  }
});


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
    res.status(500).json({ error: 'Error al obtener el historial de ventas.' });
  }
});



app.post('/api/tickets', async (req, res) => {
  const { cliente_id, asunto, categoria, prioridad, descripcion } = req.body;
  try {
    const query = `
      INSERT INTO tickets_soporte (cliente_id, asunto, categoria, prioridad, descripcion, estado)
      VALUES ($1, $2, $3, $4, $5, 'Abierto')
      RETURNING *;
    `;
    const result = await pool.query(query, [cliente_id, asunto, categoria, prioridad, descripcion]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar el ticket de soporte.' });
  }
});

app.get('/api/tickets', async (req, res) => {
  const { cliente_id, esAdmin } = req.query;
  try {
    let query = `
      SELECT t.*, c.nombre_razon_social AS cliente, c.correo 
      FROM tickets_soporte t 
      JOIN clientes c ON t.cliente_id = c.id 
    `;
    if (esAdmin !== 'true') {
      query += ` WHERE t.cliente_id = $1 `;
      const result = await pool.query(query + ` ORDER BY t.id DESC;`, [parseInt(cliente_id)]);
      return res.json(result.rows);
    }
    query += ` ORDER BY t.id DESC;`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar los tickets.' });
  }
});

app.put('/api/tickets/:id/resolver', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`UPDATE tickets_soporte SET estado = 'Resuelto' WHERE id = $1;`, [id]);
    res.json({ mensaje: 'Ticket marcado como resuelto.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el ticket.' });
  }
});



app.get('/api/equipos', async (req, res) => {
  const { cliente_id, esAdmin } = req.query;
  try {
    let query = `
      SELECT e.*, c.correo AS cliente_correo 
      FROM equipos e 
      JOIN clientes c ON e.cliente_id = c.id 
    `;
    if (esAdmin !== 'true') {
      const result = await pool.query(query + ` WHERE e.cliente_id = $1;`, [parseInt(cliente_id)]);
      return res.json(result.rows);
    }
    const result = await pool.query(query + ` ORDER BY e.id DESC;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar los equipos.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor GAP Core ejecutándose en puerto ${PORT}`));
