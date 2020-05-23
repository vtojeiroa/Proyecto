'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB } = require('../../helpers');

const { searchSchema } = require('../validations');

// GET - /INCIDENCES
async function listIncidencesValorations(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { headquarter, type_incidence, date_init, date_end } = req.query;

    let result;

    if (headquarter && type_incidence) {
      result = await connection.query(
        `SELECT i.id,i.servicios_id,i.usuarios_id, i.descripcion,
      i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro, v.valoracion,v.comentario_valoracion
       FROM incidencias i INNER JOIN valoraciones v ON i.id = v.incidencias_id WHERE i.usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
      (SELECT id FROM sedes WHERE nombre LIKE ?)) AND (i.servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;`,
        [`%${headquarter}%`, `%${type_incidence}%`]
      );
    } else if (headquarter) {
      await searchSchema.validateAsync(headquarter);

      result = await connection.query(
        `SELECT i.id,i.servicios_id,i.usuarios_id, i.descripcion,
        i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro, v.valoracion,v.comentario_valoracion
         FROM incidencias i INNER JOIN valoraciones v ON i.id = v.incidencias_id WHERE i.usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
        (SELECT id FROM sedes WHERE nombre LIKE ?)) ORDER BY fecha_registro DESC;`,
        [`%${headquarter}%`]
      );
    } else if (type_incidence) {
      await searchSchema.validateAsync(type_incidence);

      result = await connection.query(
        `SELECT i.id,i.servicios_id,i.usuarios_id, i.descripcion,
        i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro, v.valoracion,v.comentario_valoracion
         FROM incidencias i, valoraciones v WHERE i.id = v.incidencias_id AND (i.servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;`,
        [`%${type_incidence}%`]
      );
    } else if (date_init && date_end) {
      result = await connection.query(
        `SELECT i.id,i.servicios_id,i.usuarios_id, i.descripcion,
        i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro, v.valoracion,v.comentario_valoracion
         FROM incidencias i, valoraciones v WHERE i.id = v.incidencias_id  AND (i.fecha_registro >=  ? AND  i.fecha_registro <  ?) ORDER BY fecha_registro DESC
        ;`,
        [
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else {
      result = await connection.query(
        `SELECT i.id,i.servicios_id,i.usuarios_id, i.descripcion,
        i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro,
        v.valoracion, v.comentario_valoracion FROM incidencias i 
        , valoraciones v WHERE v.incidencias_id = i.id 
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

module.exports = listIncidencesValorations;
