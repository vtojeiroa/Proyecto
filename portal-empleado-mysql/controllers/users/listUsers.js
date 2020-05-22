'use strict';

require('dotenv').config();

const { getConnection } = require('../../db');

// GET /USERS ---- LIST USER (ONLY ADMIN)

async function listUsers(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    let result = await connection.query(`SELECT * FROM usuarios`);
    let [users] = result;

    res.send({
      status: 'ok',
      data: users
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  listUsers
};
