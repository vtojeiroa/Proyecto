'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');

const { getConnection } = require('../../db');

const { userSchema } = require('../validations');

const { randomString, sendEmail, generateError } = require('../../helpers');

// POST - /USER --- New User
async function newUser(req, res, next) {
  let connection;
  try {
    // Validate body payload
    await userSchema.validateAsync(req.body);

    connection = await getConnection();
    const { name, surname, email, password, headquarter } = req.body;

    // Check if user email is already in the db
    const [
      existing
    ] = await connection.query('SELECT id from usuarios where email=?', [
      email
    ]);

    if (existing.length) {
      throw generateError('El email ya existe en la base de datos', 409);
    }

    // Check if sede exists in the db
    const [
      result
    ] = await connection.query(
      `SELECT id, nombre FROM sedes WHERE nombre LIKE ?`,
      [`%${headquarter}%`]
    );

    if (!result.length) {
      throw generateError(
        'La Sede que indica no existe en la base de datos',
        404
      );
    }

    const [sede] = result;

    // hash password
    const dbPassword = await bcrypt.hash(password, 10);
    const registrationCode = randomString(40);

    const validationURL = `${process.env.PUBLIC_HOST}/users/validate?code=${registrationCode}`;

    try {
      await sendEmail({
        email: email,
        title: 'Valida tu cuenta de usuario en la app de Portal del Empleado',
        html: `<div>
      <h1>Validate your email</h1>
      <p>Para validar tu cuenta de usuario pega esta url en tu navegador: ${validationURL}</p>  
    </div>`
      });
    } catch (error) {
      console.error(error.response.body);
      throw new Error(
        'Error enviando mail de validación. Inténtalo de nuevo más tarde.'
      );
    }

    const [data] = await connection.query(
      `
      INSERT INTO usuarios (activo,nombre,apellidos,email,contraseña,fecha_actualizacion_contraseña,codigo_registro,sedes_id)
      VALUES(0 ,?,?, ?, ?,NOW(), ?, ?)
    `,
      [name, surname, email, dbPassword, registrationCode, sede.id]
    );

    res.send({
      status: 'ok',
      message: `Usuario registrado correctamente.Te hemos enviado un email al correo que nos has facilitado (Revisa la carpeta de SPAM). Sigue las instrucciones para activar tu usuario.`,
      data: {
        id: data.insertID,
        nombre: name,
        apellidos: surname,
        email: email,
        sede: sede.nombre
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newUser;
