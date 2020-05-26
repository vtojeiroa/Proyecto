'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');

const { getConnection } = require('../../db');

const { editPasswordUserSchema } = require('../validations');

const { generateError } = require('../../helpers');

// POST - /USERS /: id / PASSWORD  CHANGE PASSWORD
async function updatePasswordUser(req, res, next) {
  let connection;

  try {
    const { id } = req.params;
    // body: oldpassword, newPassword, newPasswordRepeat (optional)
    connection = await getConnection();

    await editPasswordUserSchema.validateAsync(req.body);

    const { oldPassword, newPassword } = req.body;

    // Check that the user of the token is the same as the one that we are going to change the pass

    if (Number(id) !== req.auth.id) {
      throw generateError(
        `No tienes permisos para cambiar la contraseña del usuario con id ${id}`,
        401
      );
    }

    if (oldPassword === newPassword) {
      throw generateError(
        'La nueva contraseña no puede ser la misma que la antigua',
        400
      );
    }

    // Remove the user info from the database

    const [currentUser] = await connection.query(
      `
      SELECT id, contraseña from usuarios where id=?
      `,
      [id]
    );

    if (!currentUser.length) {
      throw generateError(`El usuario con id ${id} no existe`, 404);
    }

    const [dbUser] = currentUser;

    // Check that the old password sent is correct
    // the order is: unencrypted password, encrypted password

    const passwordMatch = await bcrypt.compare(oldPassword, dbUser.contraseña);

    if (!passwordMatch) {
      throw generateError('Tu contraseña antigua es incorrecta', 401);
    }

    // generate hash of the password
    const dbNewPassword = await bcrypt.hash(newPassword, 10);

    // update the database

    await connection.query(
      `
      UPDATE usuarios SET contraseña=?, fecha_actualizacion_contraseña=NOW() WHERE id=?
    `,
      [dbNewPassword, id]
    );

    res.send({
      status: 'ok',
      message:
        'Cambio de contraseña realizado correctamente. Todos tus tokens quedan invalidados. Haz login de nuevo para conseguir un token válido.'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = updatePasswordUser;
