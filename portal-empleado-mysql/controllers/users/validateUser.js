'use strict';

require('dotenv').config();

const { getConnection } = require('../../db');

const { generateError } = require('../../helpers');

// POST - USERS/VALIDATE ---- ACTIVATE USER

async function validateUser(req, res, next) {
  let connection;

  try {
    const { code } = req.query;

    connection = await getConnection();

    // Actualizamos el usuario
    const [
      result
    ] = await connection.query(
      'UPDATE usuarios SET activo=1,codigo_registro=NULL WHERE codigo_registro=?',
      [code]
    );

    if (result.affectedRows === 0) {
      throw generateError('Validación incorrecta', 400);
    }

    // // Si queremos dar el token descomentar las siguientes líneas
    // const [user] = await connection.query('SELECT role from users where id=?', [
    //   id
    // ]);

    // // Build jsonwebtoken
    // const tokenPayload = { id: id, role: user[0].role };
    // const token = jwt.sign(tokenPayload, process.env.SECRET, {
    //   expiresIn: '30d'
    // });

    res.send({
      status: 'ok',
      message: 'Usuario validado, ya puedes hacer login.'
      // data: {
      //   token
      // }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = validateUser;
