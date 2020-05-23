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
async function getIncidence(req, res, next) {
  let connection;
  try {
    const { id } = req.params;
    const { number } = req.query;

    connection = await getConnection();

    const existData = await connection.query(
      `SELECT id, codigo_incidencia FROM incidencias WHERE id =? OR codigo_incidencia = ?`,
      [id, number]
    );
    const [dataId] = existData;

    if (!dataId.length) {
      throw generateError(`La incidencia número ${id} no existe`, 404);
    }
    if (dataId[0].id !== dataId[1].id) {
      throw generateError(
        `El número de incidencia y el codigo no corresponden a la misma incidencia`
      );
    }

    let result;
    if (number || id) {
      result = await connection.query(
        `select i.id,i.servicios_id, i.usuarios_id, i.fecha_registro, i.descripcion,i.fecha_resolucion, i.comentario_resolucion ,avg(v.valoracion) as vote
          from incidencias i
          left join valoraciones v
          on i.id = v.servicios_id
          WHERE i.codigo_incidencia = ? OR i.id = ? GROUP BY i.id`,
        [number, id]
      );
    }
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

module.exports = getIncidence;
