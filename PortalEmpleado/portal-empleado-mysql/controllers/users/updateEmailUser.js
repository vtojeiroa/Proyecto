'use strict';

require('dotenv').config();

const { getConnection } = require('../../db');

const { editEmailUserSchema } = require('../validations');

const { generateError } = require('../../helpers');

// POST - /USERS/:id/EMAIL  CHANGE EMAIL

async function updateEmailUser(req, res, next) {
  let connection;

  try {
    const { id } = req.params;

    // body: oldEmail, newEmail, newEmailRepeat (optional)
    connection = await getConnection();

    await editEmailUserSchema.validateAsync(req.body);

    const { oldEmail, newEmail } = req.body;

    // Check that the user of the token is the same as the one that we are going to change the email

    if (Number(id) !== req.auth.id) {
      throw generateError(
        `No tienes permisos para cambiar el correo electrónico del usuario con id ${id}`,
        401
      );
    }

    // Remove the user info from the database

    const [currentUser] = await connection.query(
      `
      SELECT id, email from usuarios where id=?
      `,
      [id]
    );

    if (!currentUser.length) {
      throw generateError(`El usuario con id ${id} no existe`, 404);
    }
    const [email] = currentUser;

    if (email.email !== oldEmail) {
      throw generateError(
        `El correo electrónico que quiere modificar no es el que tiene dado de alta en la base de datos`,
        404
      );
    }

    // Check if newEmail is already in the db
    const [
      existingNew
    ] = await connection.query('SELECT id from usuarios where email=?', [
      newEmail
    ]);

    if (existingNew.length) {
      throw generateError(
        'El nuevo email ya figura en la base de datos. Es necesario que indique un email que no exista en la base de datos.',
        409
      );
    }

    // update the database

    await connection.query(
      `
      UPDATE usuarios SET email=? WHERE id=?
    `,
      [newEmail, id]
    );

    res.send({
      status: 'ok',
      message: 'Cambio de correo electrónico realizado correctamente.'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = updateEmailUser;
