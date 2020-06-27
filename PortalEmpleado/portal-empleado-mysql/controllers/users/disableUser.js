'use strict';

require('dotenv').config();

const { getConnection } = require('../../db');

const { generateError } = require('../../helpers');

// DELETE - /USERS/:id  ---DESACTIVATE USER
async function disableUser(req, res, next) {
  let connection;

  try {
    const { id } = req.params;

    connection = await getConnection();

    // Delete user if exists!
    const [
      current
    ] = await connection.query('SELECT * FROM usuarios WHERE id=?', [id]);

    if (!current.length) {
      throw generateError(`El usuario con el número ${id} no existe`, 400);
    }

    await connection.query('UPDATE usuarios SET activo=0 WHERE id=?', [id]);

    res.send({
      status: 'ok',
      message: `El usuario con la id ${id} ha sido dado de baja`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = disableUser;
