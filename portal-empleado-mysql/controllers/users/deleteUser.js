'use strict';

require('dotenv').config();

const { getConnection } = require('../../db');

// DELETE - /USERS/:id  ---DESACTIVATE USER
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    const connection = await getConnection();

    await connection.query('UPDATE usuarios SET activo=0 WHERE id=?', [id]);

    connection.release();

    res.send({
      status: 'ok',
      message: `El usuario con la id ${id} ha sido dado de baja`
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  deleteUser
};
