const { Pool } = require('pg');
require('dotenv').config();

const config = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  allowExitOnIdle: process.env.ALLOW_EXIT_ON_IDLE === 'true',
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
};

const pool = new Pool(config);

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectarse a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos exitosa');
    release();
  }
});

const obtenerUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerPlatos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM platos');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener platos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerPlatoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM platos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Plato no encontrado' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error al obtener plato por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const agregarPlato = async (req, res) => {
  const { nombre, descripcion, precio, img } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO platos (nombre, descripcion, precio, img) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion, precio, img]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar plato:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const agregarUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING *',
      [email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarPlatoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM platos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Plato no encontrado' });
    } else {
      res.json({ mensaje: 'Plato eliminado correctamente', plato: result.rows[0] });
    }
  } catch (error) {
    console.error('Error al eliminar plato por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const editarPlatoPorId = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, img } = req.body;
  try {
    const result = await pool.query(
      `UPDATE platos 
      SET nombre = $1, descripcion = $2, precio = $3, img = $4 
      WHERE id = $5 
      RETURNING *`,
      [nombre, descripcion, precio, img, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Plato no encontrado' });
    } else {
      res.json({ mensaje: 'Plato actualizado correctamente', plato: result.rows[0] });
    }
  } catch (error) {
    console.error('Error al actualizar plato por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerPlatos,
  obtenerPlatoPorId,
  agregarPlato,
  agregarUsuario, 
  eliminarPlatoPorId,
  editarPlatoPorId,
};
