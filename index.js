const express = require('express');
const cors = require('cors');
const consultas = require('./consultas.js');

const app = express();
const port = 3000;

app.use(express.json()); // Middleware para analizar el cuerpo de la solicitud JSON
app.use(cors()); // Agregar el middleware cors

// Rutas para usuarios
app.get('/usuarios', consultas.obtenerUsuarios);
app.get('/usuarios/:id', consultas.obtenerUsuarioPorId);
app.post('/usuarios', consultas.agregarUsuario); // Ruta POST para agregar usuarios

// Rutas para platos
app.get('/platos', consultas.obtenerPlatos);
app.get('/platos/:id', consultas.obtenerPlatoPorId);
app.post('/platos', consultas.agregarPlato); // Ruta POST para agregar platos
app.delete('/platos/:id', consultas.eliminarPlatoPorId); // Ruta DELETE para eliminar platos
app.put('/platos/:id', consultas.editarPlatoPorId); // Ruta PUT para editar platos

// Levantar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
