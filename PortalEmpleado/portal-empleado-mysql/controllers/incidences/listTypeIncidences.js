'use strict';

const { getConnection } = require('../../db');

// GET - /INCIDENCES
async function listTypeIncidences(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    let result = await connection.query(
      `SELECT seccion, tipo,descripcion FROM servicios  WHERE activo =1 AND seccion = 'incidencia' ;`
    );

    const [data] = result;

    res.send({
      status: 'ok',
      name: `${data[0].seccion}`,
      data: {
        data
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listTypeIncidences;
