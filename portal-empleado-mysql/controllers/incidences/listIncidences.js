'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB } = require('../../helpers');

const { searchSchema } = require('../validations');

// GET - /INCIDENCES
async function listIncidences(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { headquarter, type_incidence, date_init, date_end } = req.query;

    let result;

    if (headquarter && type_incidence) {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,descripcion,fecha_resolucion, comentario_resolucion, fecha_registro FROM incidencias WHERE usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
      (SELECT id FROM sedes WHERE nombre LIKE ?)) AND (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;`,
        [`%${headquarter}%`, `%${type_incidence}%`]
      );
    } else if (headquarter) {
      await searchSchema.validateAsync(headquarter);

      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,descripcion,fecha_resolucion, comentario_resolucion, fecha_registro FROM incidencias WHERE usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
        (SELECT id FROM sedes WHERE nombre LIKE ?)) ORDER BY fecha_registro DESC;`,
        [`%${headquarter}%`]
      );
    } else if (type_incidence) {
      await searchSchema.validateAsync(type_incidence);

      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,descripcion,fecha_resolucion, comentario_resolucion, fecha_registro FROM incidencias WHERE (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;`,
        [`%${type_incidence}%`]
      );
    } else if (date_init && date_end) {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,descripcion,fecha_resolucion, comentario_resolucion, fecha_registro FROM incidencias WHERE (fecha_registro >=  ? AND  fecha_registro <  ?) ORDER BY fecha_registro DESC
        ;`,
        [
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,descripcion,fecha_resolucion, comentario_resolucion, fecha_registro FROM incidencias ORDER BY fecha_registro DESC`
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
