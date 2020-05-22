'use strict';

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

const newUser = require('./controllers/users/newUser');
const listUsers = require('./controllers/users/listUsers');
const getUser = require('./controllers/users/getUser');
const editUser = require('./controllers/users/editUser');
const loginUser = require('./controllers/users/loginUser');
const updatePasswordUser = require('./controllers/users/updatePasswordUser');
const validateUser = require('./controllers/users/validateUser');
const deleteUser = require('./controllers/users/deleteUser');
const recoveryPassUser = require('./controllers/users/recoveryPassUser');

// Incidences controllers

const listIncidences = require('./controllers/incidences/listIncidences');
const newIncidence = require('./controllers/incidences/newIncidence');
const getIncidence = require('./controllers/incidences/getIncidence');
const deleteIncidence = require('./controllers/incidences/deleteIncidence');
const editIncidence = require('./controllers/incidences/editIncidence');
const voteIncidence = require('./controllers/incidences/voteIncidence');

// Reserves controllers

const listReserves = require('./controllers/reserves/listReserves');
const newReserve = require('./controllers/reserves/newReserve');
const getReserve = require('./controllers/reserves/getReserve');
const deleteReserve = require('./controllers/reserves/deleteReserve');
const editReserve = require('./controllers/reserves/editReserve');
const voteReserve = require('./controllers/reserves/voteReserve');

// Votes controllers
const getEntryVotes = require('./controllers/votes/getEntryVotes');
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
app.post('/users/password/recovery', recoveryPassUser);
app.get('/users/validate', validateUser); //Validación inicial del usuario-ok
app.post('/users/:id/password', userIsAuthenticated, updatePasswordUser); // Cambiar password-ok
app.get('/users/:id', userIsAuthenticated, getUser); //Listar perfil-ok
app.put('/users/:id', userIsAuthenticated, editUser); //Editar perfil-ok
app.delete('/users/:id', userIsAuthenticated, userIsAdmin, deleteUser); //Desactivar un usuario-solo Admin-

// Incidences routes
app.get('/incidences', listIncidences); //Listar todas las incidencias
app.post('/incidences', userIsAuthenticated, newIncidence); //Crear nueva incidencia
app.get('/incidences/:id', userIsAuthenticated, getIncidence); // Listar una incidencia
app.delete(
  '/incidences/:id',
  userIsAuthenticated,
  userIsAdmin,
  deleteIncidence
); // Solo admin Borrar una incidencia
app.put('/incidences/:id', userIsAuthenticated, editIncidence); // Usuario modifica descripcion / Maintenance contesta la incidencia y envia correo)
/* app.get('/incidences/:id/vote', permisionToVote);*/
app.post('/incidences/:id/vote', userIsAuthenticated, voteIncidence);

// Reserve routes

app.get('/reserves', listReserves); //Listar todas las reservas
app.post('/reserves', userIsAuthenticated, newReserve); //Crear nueva reserva
app.get('/reserves/:id', /* userIsAuthenticated, */ getReserve); // Listar una reserva
app.delete('/reserves/:id', userIsAuthenticated, deleteReserve); // Solo admin Borrar una reserva
app.put('/reserves/:id', userIsAuthenticated, editReserve); // Usuario modifica descripcion / Maintenance contesta la reserva y envia correo)
/* app.get('/reserves/:id/vote', perToVote);*/
app.post('/reserves/:id/vote', userIsAuthenticated, voteReserve); //Votar una reserva

//Votes routes
app.get('/votes', getEntryVotes); // Listar las votaciones por tipo de servicio

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
