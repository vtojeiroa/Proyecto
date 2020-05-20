require('dotenv').config();

const express = require('express');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT;

// Controllers

//User controllers

const {
  newUser,
  listUsers,
  getUser,
  editUser,
  loginUser,
  updatePasswordUser,
  validateUser,
  deleteUser
} = require('./controllers/users');

// Portal controllers

const {
  listIncidences,
  newIncidence,
  getIncidence,
  deleteIncidence,
  permisionToVote,
  voteIncidence,
  editIncidence,
  getEntryVotes
} = require('./controllers/incidences');

// Middlewares

// Auth middlewares
const { userIsAuthenticated, userIsAdmin } = require('./middlewares/auth');

// Console logger middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(bodyParser.json());

// Multipart parsing middleware
app.use(fileUpload());

// CORS middleware
app.use(cors());

// Serve static middleware
app.use(express.static(path.join(__dirname, 'static')));

// Routes

// User routes
app.post('/users', newUser); //Registro nuevo usuario-ok
app.get('/users/', userIsAuthenticated, userIsAdmin, listUsers); //Listar usuarios solo Admin
app.post('/users/login', loginUser); //Login usuario-ok
app.get('/users/validate', validateUser); //Validación inicial del usuario-ok
app.post('/users/:id/password', userIsAuthenticated, updatePasswordUser); // Cambiar password-ok
app.get('/users/:id', userIsAuthenticated, getUser); //Listar perfil-ok
app.put('/users/:id', userIsAuthenticated, editUser); //Editar perfil-ok
app.delete('/users/:id', userIsAuthenticated, userIsAdmin, deleteUser); //Desactivar un usuario-solo Admin-

/* // Reservas routes
app.get('/entries', listEntries);
app.get('/entries/:id', getEntry);
app.post('/entries', userIsAuthenticated, newEntry); // Solo usuarios
app.get('/entries/:id/votes', getEntryVotes);
app.post('/entries/:id/votes', userIsAuthenticated, voteEntry); // Solo usuarios
app.put('/entries/:id', userIsAuthenticated, editEntry); // Solo usuarios (que crearon esa entrada) o admin
app.delete('/entries/:id', userIsAuthenticated, userIsAdmin, deleteEntry); // Solo admin */

// Incidences routes
app.get('/incidences', listIncidences); //Listar todas las incidencias
app.post('/incidences', userIsAuthenticated, newIncidence); //Crear nueva incidencia
app.get('/incidences/votes', getEntryVotes);
app.get('/incidences/:id', userIsAuthenticated, getIncidence); // Listar una incidencia
app.delete(
  '/incidences/:id',
  userIsAuthenticated,
  userIsAdmin,
  deleteIncidence
); // Solo admin Borrar una incidencia
app.put('/incidences/:id', userIsAuthenticated, editIncidence); // Usuario modifica descripcion / Maintenance contesta la incidencia y envia correo)
app.get('/incidences/:id/vote', permisionToVote);
app.post('/incidences/:id/vote', userIsAuthenticated, voteIncidence);

// Booking routes

/* app.get('/booking', listBookings); */

// Error middleware
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.httpCode || 500).send({
    status: 'error',
    message: error.message
  });
});

// Not found middleware
app.use((req, res) => {
  res.status(404).send({ status: 'error', message: 'Not found' });
});

app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port} 🚀`);
});
