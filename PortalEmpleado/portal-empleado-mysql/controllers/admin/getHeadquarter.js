'use strict';

const { getConnection } = require('../../db');

// GET - /Headquarter

async function getHeadquarter(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    let result = await connection.query(`SELECT * FROM sedes`);

    const [data] = result;

    res.send({
      status: 'ok',
      data: data
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getHeadquarter;
