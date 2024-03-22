const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rest_back',
  password: '',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error al conectarse a la base de datos:', err);
  }
  console.log('Conexión a la base de datos exitosa');
  release(); // Liberar el cliente de la base de datos
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
    const { nombre, descripcion, precio, img } = req.body; // Obtener datos del cuerpo de la solicitud
    try {
      const result = await pool.query(
        'INSERT INTO platos (nombre, descripcion, precio, img) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, descripcion, precio, img]
      );
      res.status(201).json(result.rows[0]); // Devolver el plato recién creado
    } catch (error) {
      console.error('Error al agregar plato:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  const agregarUsuario = async (req, res) => {
    const { email, password } = req.body; // Obtener datos del cuerpo de la solicitud
    try {
      const result = await pool.query(
        'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING *',
        [email, password]
      );
      res.status(201).json(result.rows[0]); // Devolver el usuario recién creado
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
    const { nombre, descripcion, precio, img } = req.body; // Obtener los nuevos datos del plato desde el cuerpo de la solicitud
    try {
      const result = await pool.query(
        'UPDATE platos SET nombre = $1, descripcion = $2, precio = $3, img = $4 WHERE id = $5 RETURNING *',
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
  