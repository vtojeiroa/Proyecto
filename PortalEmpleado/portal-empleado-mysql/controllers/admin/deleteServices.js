'use strict';

const { getConnection } = require('../../db');

const { generateError } = require('../../helpers');

// POST - /services
async function deleteServices(req, res, next) {
  let connection;

  try {
    const { id } = req.params;

    connection = await getConnection();

    // Delete service if exists!
    const [
      current
    ] = await connection.query('SELECT * FROM servicios WHERE id=?', [id]);

    if (!current.length) {
      throw generateError(`El servicio con el número ${id} no existe`, 400);
    }

    await connection.query(`UPDATE servicios SET activo=0 WHERE id=?`, [id]);

    res.send({
      status: 'ok',
      message: `El servicio con la id ${id} ha sido dado de baja`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteServices;
