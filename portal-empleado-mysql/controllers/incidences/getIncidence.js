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
    let result;
    if (number) {
      result = await connection.query(
        `select i.id,i.servicios_id, i.usuarios_id, i.fecha_registro, i.descripcion,i.fecha_resolucion, i.comentario_resolucion ,avg(v.valoracion) as vote
          from incidencias i
          left join valoraciones v
          on i.id = v.servicios_id
          WHERE i.codigo_incidencia = ? GROUP BY i.id`,
        [number]
      );
    } else {
      result = await connection.query(
        `select i.id,i.servicios_id, i.usuarios_id, i.fecha_registro, i.descripcion,i.fecha_resolucion, i.comentario_resolucion ,avg(v.valoracion) as vote
          from incidencias i
          left join valoraciones v
          on i.id = v.servicios_id
          WHERE i.id = ? GROUP BY i.id`,
        [id]
      );
    }
    const [data] = result;

    if (!data[0].id) {
      throw generateError(`La incidencia número ${id} no existe`, 404);
    }

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
