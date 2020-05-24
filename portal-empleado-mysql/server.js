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
const getUser = require('./controllers/users/getUser');
const editUser = require('./controllers/users/editUser');
const loginUser = require('./controllers/users/loginUser');
const updatePasswordUser = require('./controllers/users/updatePasswordUser');
const validateUser = require('./controllers/users/validateUser');
const deleteUser = require('./controllers/users/deleteUser');
const recoveryPassUser = require('./controllers/users/recoveryPassUser');

// Incidences controllers

const listIncidences = require('./controllers/incidences/listIncidences');
const listIncidencesValorations = require('./controllers/incidences/listIncidencesValorations');
const listTypeIncidences = require('./controllers/incidences/listTypeIncidences');
const newIncidence = require('./controllers/incidences/newIncidence');
const getIncidence = require('./controllers/incidences/getIncidence');
const deleteIncidence = require('./controllers/incidences/deleteIncidence');
const editIncidence = require('./controllers/incidences/editIncidence');
const voteIncidence = require('./controllers/incidences/voteIncidence');

// Reserves controllers

const listReserves = require('./controllers/reserves/listReserves');
const listReservesValorations = require('./controllers/reserves/listReservesValorations');
const listTypeReserves = require('./controllers/reserves/listTypeReserves');
const newReserve = require('./controllers/reserves/newReserve');
const getReserve = require('./controllers/reserves/getReserve');
const deleteReserve = require('./controllers/reserves/deleteReserve');
const editReserve = require('./controllers/reserves/editReserve');
const voteReserve = require('./controllers/reserves/voteReserve');

// Votes controllers
const getEntryVotes = require('./controllers/votes/getEntryVotes');

// Admin controllers
const listUsers = require('./controllers/admin/listUsers');
const createServices = require('./controllers/admin/createServices');
const getServices = require('./controllers/admin/getServices');
const editServices = require('./controllers/admin/editServices');
const deleteServices = require('./controllers/admin/deleteServices');
const createHeadquarter = require('./controllers/admin/createHeadquarter');
const getHeadquarter = require('./controllers/admin/getHeadquarter');
const editHeadquarter = require('./controllers/admin/editHeadquarter');
const deleteHeadquarter = require('./controllers/admin/deleteHeadquarter');
const createAssignment = require('./controllers/admin/createAssignment');
const getAssignment = require('./controllers/admin/getAssignment');
const editAssignment = require('./controllers/admin/editAssignment');
const deleteAssignment = require('./controllers/admin/deleteAssignment');

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

// Admin routes

app.get('/users/', userIsAuthenticated, userIsAdmin, listUsers); //Listar usuarios - solo Admin
app.post('/services', userIsAuthenticated, userIsAdmin, createServices); //Crear nuevos Servicios - solo Admin
app.get('/services', userIsAuthenticated, userIsAdmin, getServices); //Listar los Servicios- solo Admin
app.put('/services/:id', userIsAuthenticated, userIsAdmin, editServices); //Editar un Servicio- solo Admin
app.delete('/services/:id', userIsAuthenticated, userIsAdmin, deleteServices); //Borrar un Servicios- solo Admin
app.post('/headquarters', userIsAuthenticated, userIsAdmin, createHeadquarter); //Crear nuevas Sedes - solo Admin
app.get('/Headquarters', userIsAuthenticated, userIsAdmin, getHeadquarter); //Listar las Sedes- solo Admin
app.put('/Headquarters/:id', userIsAuthenticated, userIsAdmin, editHeadquarter); //Editar una Sede - solo Admin
app.delete(
  '/Headquarters/:id',
  userIsAuthenticated,
  userIsAdmin,
  deleteHeadquarter
); //Borrar una Sede - solo Admin
app.post('/assignment', userIsAuthenticated, userIsAdmin, createAssignment); //Crear nuevas Sedes - solo Admin
app.get('/assignment', userIsAuthenticated, userIsAdmin, getAssignment); //Listar las Sedes- solo Admin
app.put('/assignment/:id', userIsAuthenticated, userIsAdmin, editAssignment); //Editar una Sede - solo Admin
app.delete(
  '/assignment/:id',
  userIsAuthenticated,
  userIsAdmin,
  deleteAssignment
); //Borrar una Sede - solo Admin

// User routes

app.post('/users', newUser); //Registro nuevo usuario-ok
app.post('/users/login', loginUser); //Login usuario-ok
app.post('/users/password/recovery', recoveryPassUser);
app.get('/users/validate', validateUser); //Validación inicial del usuario-ok
app.post('/users/:id/password', userIsAuthenticated, updatePasswordUser); // Cambiar password-ok
app.get('/users/:id', userIsAuthenticated, getUser); //Listar perfil-ok
app.put('/users/:id', userIsAuthenticated, editUser); //Editar perfil-ok
app.delete('/users/:id', userIsAuthenticated, userIsAdmin, deleteUser); //Desactivar un usuario-solo Admin-

// Incidences routes
app.get('/incidences', listIncidences); //Listar todas las incidencias
app.get('/incidences/valorations', listIncidencesValorations); //Listar todas las incidencias que tienen valoración
app.get('/incidences/type', listTypeIncidences); //Listar todos los tipos de incidencias
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
app.get('/reserves/valorations', listReservesValorations); //Listar todas las reservas que tienen valoración
app.get('/reserves/type', listTypeReserves); //Listar todos los tipos de reservas
app.post('/reserves', userIsAuthenticated, newReserve); //Crear nueva reserva
app.get('/reserves/:id', userIsAuthenticated, getReserve); // Listar una reserva
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
