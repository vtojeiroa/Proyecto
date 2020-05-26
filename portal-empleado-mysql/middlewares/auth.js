'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');

const { getConnection } = require('../db');
const { generateError } = require('../helpers');

async function userIsAuthenticated(req, res, next) {
  let connection;

  try {
    // Check if the authorization header is valid
    const { authorization } = req.headers;

    if (!authorization) {
      throw generateError(
        'Es necesario que hagas login en el Portal con tu usuario y contraseña.'
      );
    }

    const authorizationParts = authorization.split(' ');

    let token;

    if (authorizationParts.length === 1) {
      token = authorization;
    } else if (authorizationParts[0] === 'Bearer') {
      token = authorizationParts[1];
    } else {
      throw generateError('No puedo leer el token.');
    }

    let decoded;
    try {
      decoded = jwt.verify(authorization, process.env.SECRET);
    } catch (error) {
      throw new Error('El token no está bien formado.');
    }

    //Check that the token issuance date is greater than the
    // last password update date of the user

    const { id, iat } = decoded;

    connection = await getConnection();

    const [
      result
    ] = await connection.query(
      'SELECT fecha_actualizacion_contraseña FROM usuarios WHERE id=?',
      [id]
    );

    if (!result.length) {
      throw new Error('El usuario no existe en la base de datos.');
    }

    const [user] = result;

    // Check that the token date is greater than user.lastPasswordUpdate

    if (new Date(iat * 1000) < new Date(user.cha_actualizacion_contraseña)) {
      throw new Error('El token ya no vale, haz login para conseguir otro.');
    }

    req.auth = decoded;
    next();
  } catch (error) {
    error.httpCode = 401;
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

function userIsAdmin(req, res, next) {
  if (!req.auth || req.auth.role !== 'admin') {
    const error = new Error('No tienes privilegios de administración');
    error.httpCode = 401;
    return next(error);
  }

  next();
}

module.exports = {
  userIsAuthenticated,
  userIsAdmin
};
