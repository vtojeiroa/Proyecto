'use strict';

const { getConnection } = require('../../db');

const { generateError } = require('../../helpers');

// POST - /services
async function deleteHeadquarter(req, res, next) {
  let connection;

  try {
    const { id } = req.params;

    connection = await getConnection();

    // Delete service if exists!
    const [current] = await connection.query('SELECT * FROM sedes WHERE id=?', [
      id
    ]);

    if (!current.length) {
      throw generateError(`La sede con el número ${id} no existe`, 400);
    }

    await connection.query(`UPDATE sedes SET activo=0 WHERE id=?`, [id]);

    res.send({
      status: 'ok',
      message: `La sede con la id ${id} ha sido dada de baja`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteHeadquarter;
