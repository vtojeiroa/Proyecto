'use strict';

const { getConnection } = require('../../db');

// GET - /incidences/:id
async function listActiveIncidences(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    let result = await connection.query(
      `select id,(select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id, usuarios_id,activo,fecha_registro, descripcion,fecha_resolucion, comentario_resolucion from incidencias WHERE activo = 1  GROUP BY id`
    );

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

module.exports = listActiveIncidences;
