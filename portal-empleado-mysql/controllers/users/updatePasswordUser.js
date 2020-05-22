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
    // body: oldpassword, newPassword, newPasswordRepeat (opcional)
    connection = await getConnection();

    await editPasswordUserSchema.validateAsync(req.body);

    const { oldPassword, newPassword } = req.body;

    // Comprobar que el usuario del token es el mismo que el que vamos a cambiar la pass

    if (Number(id) !== req.auth.id) {
      throw generateError(
        `No tienes permisos para cambiar la password del usuario con id ${id}`,
        401
      );
    }

    if (oldPassword === newPassword) {
      throw generateError(
        'La nueva password no puede ser la misma que la antigua',
        400
      );
    }

    // Sacar la info del usuario de la base de datos
    const [currentUser] = await connection.query(
      `
      SELECT id, contraseña from usuarios where id=?
      `,
      [id]
    );

    // Código un poco redundante
    if (!currentUser.length) {
      throw generateError(`El usuario con id ${id} no existe`, 404);
    }

    const [dbUser] = currentUser;

    // Comprobar que la vieja password envíada sea la correcta
    // el orden es: password sin encriptar, password encriptada
    const passwordMatch = await bcrypt.compare(oldPassword, dbUser.contraseña);

    if (!passwordMatch) {
      throw generateError('Tu password antigua es incorrecta', 401);
    }

    // generar hash de la password
    const dbNewPassword = await bcrypt.hash(newPassword, 10);

    // actualizar la base de datos
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
