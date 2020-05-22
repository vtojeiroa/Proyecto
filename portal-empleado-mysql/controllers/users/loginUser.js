'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getConnection } = require('../../db');

const { userLoginSchema } = require('../validations');

const { generateError } = require('../../helpers');

// POST - /USERS/LOGIN ----LOGIN USER
async function loginUser(req, res, next) {
  let connection;

  try {
    await userLoginSchema.validateAsync(req.body);

    const { email, password } = req.body;

    connection = await getConnection();

    // Find the user in the db by email
    const [
      dbUser
    ] = await connection.query(
      'SELECT id, email, contraseña, tipo_usuario, sedes_id  from usuarios where email=? AND activo=1',
      [email]
    );

    if (!dbUser.length) {
      throw generateError(
        'No hay ningún usuario activo con ese email en la base de datos. Si te acabas de registrar valida el email',
        404
      );
    }

    const [user] = dbUser;

    const passwordMatch = await bcrypt.compare(password, user.contraseña);

    if (!passwordMatch) {
      throw generateError('Password incorrecta', 401);
    }

    // Build jsonwebtoken
    const tokenPayload = {
      id: user.id,
      role: user.tipo_usuario,
      email: user.email,
      headquarter: user.sedes_id
    };
    const token = jwt.sign(tokenPayload, process.env.SECRET, {
      expiresIn: '30d'
    });

    // Create response
    res.send({
      status: 'ok',
      message: 'Login correcto',
      data: { token }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = loginUser;
