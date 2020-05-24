'use strict';

const { getConnection } = require('../../db');

const { generateError } = require('../../helpers');

// POST - /services
async function deleteAssignment(req, res, next) {
  let connection;
  //Meterlos en la base de datos
  try {
    const { id } = req.params;

    connection = await getConnection();

    // Delete service if exists!
    const [
      current
    ] = await connection.query('SELECT * FROM sedes_servicios WHERE id=?', [
      id
    ]);

    if (!current.length) {
      throw generateError(`El servicio con el número ${id} no existe`, 400);
    }

    await connection.query(`DELETE FROM sedes_servicios WHERE id=?`, [id]);

    res.send({
      status: 'ok',
      message: `La asignacion con la id ${id} ha sido borrada`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteAssignment;
