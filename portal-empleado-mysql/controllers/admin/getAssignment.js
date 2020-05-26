'use strict';

const { getConnection } = require('../../db');

// GET - /ASSIGNMENT

async function getAssignment(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    let result = await connection.query(`SELECT id, (SELECT nombre FROM sedes WHERE id = sedes_id) AS sede,
     (SELECT seccion FROM servicios WHERE id = servicios_id) AS servicio ,(SELECT tipo FROM servicios WHERE id = servicios_id) AS tipo, disponibilidad_servicios FROM sedes_servicios`);

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

module.exports = getAssignment;
