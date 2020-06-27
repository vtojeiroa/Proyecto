'use strict';

const { getConnection } = require('../../db');
const { generateError } = require('../../helpers');

// GET - /incidences/:id
async function getIncidenceById(req, res, next) {
  let connection;
  try {
    const { id } = req.params;
    const userId = req.auth.id;

    connection = await getConnection();

    const existData = await connection.query(
      `SELECT id,usuarios_id, codigo_incidencia FROM incidencias WHERE id = ?`,
      [id]
    );
    const [dataId] = existData;

    if (!dataId.length) {
      throw generateError(`La incidencia con el código ${id} no existe`, 404);
    }

    if (dataId[0].usuarios_id !== userId) {
      throw generateError(
        `No tienes permisos para visualizar la incidencia ${id}`,
        403
      );
    }

    let result = await connection.query(
      `select id,servicios_id, usuarios_id, fecha_registro, descripcion,fecha_resolucion, comentario_resolucion from incidencias WHERE id = ?  GROUP BY id`,
      [id]
    );

    const [data] = result;

    res.send({
      status: 'ok',
      data: data[0]
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getIncidenceById;
