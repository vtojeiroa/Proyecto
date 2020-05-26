'use strict';

const { getConnection } = require('../../db');
const {
  /*     formatDateToDB,
    sendEmail,
    randomString, */
  generateError
} = require('../../helpers');

/* const {
    incidenceSchema,
    voteSchema,
    searchSchema,
    editIncidenceSchema
} = require('../validations'); */

// GET - /incidences/:id
async function getIncidenceByCode(req, res, next) {
  let connection;
  try {
    const { code } = req.query;
    const userId = req.auth.id;

    connection = await getConnection();

    if (!code) {
      throw generateError(`No ha indicado ningún código de incidencia`, 404);
    }

    const existData = await connection.query(
      `SELECT id,usuarios_id, codigo_incidencia FROM incidencias WHERE codigo_incidencia = ?`,
      [code]
    );
    const [dataId] = existData;

    if (!dataId.length) {
      throw generateError(`La incidencia con el código ${code} no existe`, 404);
    }

    if (dataId[0].usuarios_id !== userId) {
      throw generateError(
        `No tienes permisos para visualizar la incidencia ${code}`,
        403
      );
    }

    let result = await connection.query(
      `select id,servicios_id, usuarios_id, fecha_registro, descripcion,fecha_resolucion, comentario_resolucion from incidencias WHERE codigo_incidencia = ?  GROUP BY id`,
      [code]
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

module.exports = getIncidenceByCode;
