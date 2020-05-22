'use strict';

const { getConnection } = require('../../db');

const { searchSchema } = require('../validations');

// GET - /RESERVES
async function listReserves(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { search } = req.query;

    let result;

    if (search) {
      await searchSchema.validateAsync(search);

      result = await connection.query(
        `SELECT r.*, v.valoracion, v.comentario_valoracion,v.fecha_registro  FROM reservas r, valoraciones v
        WHERE v.incidencias_id = r.id  AND r.usuarios_id IN 
        (SELECT id FROM usuarios WHERE sedes_id IN
        (SELECT id FROM sedes WHERE nombre LIKE ?)) 
        ORDER BY r.fecha_registro;`,
        [`%${search}%`]
      );
    } else {
      result = await connection.query(
        `SELECT r.*, v.valoracion, v.comentario_valoracion,v.fecha_registro FROM reservas r 
        INNER JOIN valoraciones v WHERE r.id= v.incidencias_id  
        ORDER BY r.id DESC`
      );
    }

    const [entries] = result;

    res.send({
      status: 'ok',
      data: entries
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listReserves;
