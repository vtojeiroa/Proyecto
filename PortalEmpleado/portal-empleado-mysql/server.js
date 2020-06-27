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
const updateEmailUser = require('./controllers/users/updateEmailUser');
const validateUser = require('./controllers/users/validateUser');
const disableUser = require('./controllers/users/disableUser');
const recoveryPassUser = require('./controllers/users/recoveryPassUser');

// Incidences controllers

const searchIncidences = require('./controllers/incidences/searchIncidences');
const listIncidences = require('./controllers/incidences/listIncidences');
const listTypeIncidences = require('./controllers/incidences/listTypeIncidences');
const newIncidence = require('./controllers/incidences/newIncidence');
const getIncidenceByCode = require('./controllers/incidences/getIncidenceByCode');
const getIncidenceById = require('./controllers/incidences/getIncidenceById');
const deleteIncidence = require('./controllers/incidences/deleteIncidence');
const editIncidence = require('./controllers/incidences/editIncidence');
const adminEditIncidence = require('./controllers/incidences/adminEditIncidence');
const listActiveIncidences = require('./controllers/incidences/listActiveIncidences');
const voteIncidence = require('./controllers/incidences/voteIncidence');
const VoteWithCode = require('./controllers/incidences/voteWithCode');

// Reserves controllers

const searchReserves = require('./controllers/reserves/searchReserves');
const listReserves = require('./controllers/reserves/listReserves');
const listTypeReserves = require('./controllers/reserves/listTypeReserves');
const newReserve = require('./controllers/reserves/newReserve');
const getReserveByCode = require('./controllers/reserves/getReserveByCode');
const getReserveById = require('./controllers/reserves/getReserveById');
const deleteReserve = require('./controllers/reserves/deleteReserve');
const editReserve = require('./controllers/reserves/editReserve');
const voteReserve = require('./controllers/reserves/voteReserve');

// Votes controllers
const getEntryVotes = require('./controllers/votes/getEntryVotes');

// Admin controllers
const deleteUser = require('./controllers/admin/deleteUser');
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

// Attention users controllers
const makeQuestion = require('./controllers/attentionUsers/makeQuestion');

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
app.delete('/admin/users/:id', userIsAuthenticated, userIsAdmin, deleteUser); //Borrar un usuario de la BBDD - solo Admin
app.get('/admin/users', userIsAuthenticated, userIsAdmin, listUsers); //Listar usuarios - solo Admin
app.post('/services', userIsAuthenticated, userIsAdmin, createServices); //Crear nuevos Servicios - solo Admin
app.get('/services', userIsAuthenticated, userIsAdmin, getServices); //Listar los Servicios- solo Admin
app.put('/services/:id', userIsAuthenticated, userIsAdmin, editServices); //Editar un Servicio- solo Admin
app.delete('/services/:id', userIsAuthenticated, userIsAdmin, deleteServices); //Borrar un Servicios- solo Admin
app.post('/headquarters', userIsAuthenticated, userIsAdmin, createHeadquarter); //Crear nuevas Sedes - solo Admin
app.get('/headquarters', userIsAuthenticated, userIsAdmin, getHeadquarter); //Listar las Sedes- solo Admin
app.put('/headquarters/:id', userIsAuthenticated, userIsAdmin, editHeadquarter); //Editar una Sede - solo Admin
app.delete(
  '/eadquarters/:id',
  userIsAuthenticated,
  userIsAdmin,
  deleteHeadquarter
); //Borrar una Sede - solo Admin
app.post('/assignment', userIsAuthenticated, userIsAdmin, createAssignment); //Crear nuevas Asignaciones - solo Admin
app.get('/assignment', userIsAuthenticated, userIsAdmin, getAssignment); //Listar las Asignaciones- solo Admin
app.put('/assignment/:id', userIsAuthenticated, userIsAdmin, editAssignment); //Editar una Asignación - solo Admin
app.delete(
  '/assignment/:id',
  userIsAuthenticated,
  userIsAdmin,
  deleteAssignment
); //Borrar una Asignación - solo Admin

// Attencion to users routes
app.post('/attention', makeQuestion); //Registro nuevo usuario

// User routes

app.post('/users', newUser); //Registro nuevo usuario
app.post('/users/login', loginUser); //Login usuario
app.post('/users/password/recovery', recoveryPassUser); // Proceso para recuperar la contraseña
app.get('/users/validate', validateUser); //Validación inicial del usuario
app.post('/users/:id/password', userIsAuthenticated, updatePasswordUser); // Cambiar password
app.post('/users/:id/email', userIsAuthenticated, updateEmailUser); // Cambiar Email de registro
app.get('/users/:id', userIsAuthenticated, getUser); //Listar perfil
app.put('/users/:id', userIsAuthenticated, editUser); //Editar perfil
app.delete('/users/:id', userIsAuthenticated, userIsAdmin, disableUser); //Dar de baja un usuario -User o  Admin-

// Incidences routes
app.get('/incidences', searchIncidences); //Buscar incidencias
app.get(
  '/incidences/active',
  userIsAuthenticated,
  userIsAdmin,
  listActiveIncidences
); //Listar todas las incidencias activas

app.get('/incidences/list', userIsAuthenticated, listIncidences); //Listar todas las incidencias por usuario
app.get('/incidences/type', listTypeIncidences); //Listar todos los tipos de incidencias
app.post('/incidences', userIsAuthenticated, newIncidence); //Crear nueva incidencia
app.get('/incidences/code/:code', getIncidenceByCode); // Buscar una incidencia por el código recibido al registrarla
app.get('/incidences/:id', userIsAuthenticated, getIncidenceById); // Buscar una incidencia por id de la incidencia
app.delete('/incidences/:id', userIsAuthenticated, deleteIncidence); //  Borrar una incidencia - usuario si no se ha cerrado o admin en cualquier caso
app.put('/incidences/:id', userIsAuthenticated, editIncidence); // Usuario modifica descripcion de la incidencia / Maintenance contesta la incidencia y envia correo)
app.put(
  '/incidences/admin/:id',
  userIsAuthenticated,
  userIsAdmin,
  adminEditIncidence
); //Admin contesta la incidencia y envia correo)
app.post('/incidences/:id/vote', userIsAuthenticated, voteIncidence); //Votar una incidencia
app.get('/incidences/:id/vote', VoteWithCode); // Votar una una incidencia con el código recibido al cerrarse la incidencia.

// Reserve routes

app.get('/reserves', searchReserves); //Buscar reservas
app.get('/reserves/list', userIsAuthenticated, listReserves); //Listar todas las reservas
app.get('/reserves/type', listTypeReserves); //Listar todos los tipos de reservas
app.post('/reserves', userIsAuthenticated, newReserve); //Crear nueva reserva
app.get('/reserves/code/:code', getReserveByCode); // Buscar una reserva por el código recibido al registrarla
app.get('/reserves/:id', userIsAuthenticated, getReserveById); // Listar una reserva
app.delete('/reserves/:id', userIsAuthenticated, deleteReserve); //  Borrar una reserva  Solo admin
app.put('/reserves/:id', userIsAuthenticated, editReserve); // Usuario modifica descripcion / Maintenance contesta la reserva y envia correo)
app.post('/reserves/:id/vote', userIsAuthenticated, voteReserve); //Votar una reserva

//Votes routes
app.get('/votes', getEntryVotes); // Listar las votaciones por tipo de servicio y media de valoración

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
