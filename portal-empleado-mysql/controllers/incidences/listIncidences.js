'use strict';

const { getConnection } = require('../../db');
/* const {
    formatDateToDB,
    sendEmail,
    randomString,
    generateError
} = require('../../helpers');
 */
const { searchSchema } = require('../validations');

// GET - /INCIDENCES
async function listIncidences(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { search } = req.query;

    let result;

    if (search) {
      await searchSchema.validateAsync(search);

      result = await connection.query(
        `SELECT i.id,i.servicios_id,i.usuarios_id, i.descripcion,
        i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro,
        v.valoracion, v.comentario_valoracion  FROM incidencias i INNER JOIN valoraciones v
       ON  v.incidencias_id = i.id WHERE i.usuarios_id IN 
        (SELECT id FROM usuarios WHERE sedes_id IN
        (SELECT id FROM sedes WHERE nombre LIKE ?)) 
        ORDER BY fecha_registro;`,
        [`%${search}%`]
      );
    } else {
      result = await connection.query(
        `SELECT i.id,i.servicios_id,i.usuarios_id, i.descripcion,
        i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro,
        v.valoracion, v.comentario_valoracion FROM incidencias i 
        INNER JOIN valoraciones v WHERE v.incidencias_id = i.id 
        ORDER BY fecha_registro DESC`
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

module.exports = listIncidences;
