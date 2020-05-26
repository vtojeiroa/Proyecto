'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB, generateError } = require('../../helpers');

// GET - /INCIDENCES
async function searchIncidences(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { headquarter, type, date_init, date_end } = req.query;

    let result;

    if (headquarter && type && date_init && date_end) {
      result = await connection.query(
        `SELECT i.id,i.servicios_id,i.usuarios_id,i.descripcion,i.fecha_resolucion, i.comentario_resolucion,i.fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = i.id) AS fecha_registro_valoracion FROM incidencias i WHERE usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
      (SELECT id FROM sedes WHERE nombre LIKE ?)) AND (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) AND (fecha_registro >=  ? AND  fecha_registro <  ?)  ORDER BY fecha_registro DESC;`,
        [
          `%${headquarter}%`,
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter && type) {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,descripcion,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
      (SELECT id FROM sedes WHERE nombre LIKE ?)) AND (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?))  ORDER BY fecha_registro DESC;`,
        [`%${headquarter}%`, `%${type}%`]
      );
    } else if (headquarter && date_init && date_end) {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,descripcion,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
      (SELECT id FROM sedes WHERE nombre LIKE ?)) AND (fecha_registro >=  ? AND  fecha_registro <  ?)  ORDER BY fecha_registro DESC;`,
        [
          `%${headquarter}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (type && date_init && date_end) {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,descripcion,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) AND (fecha_registro >=  ? AND  fecha_registro <  ?)  ORDER BY fecha_registro DESC;`,
        [
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter) {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,descripcion,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
        (SELECT id FROM sedes WHERE nombre LIKE ?)) ORDER BY fecha_registro DESC;`,
        [`%${headquarter}%`]
      );
    } else if (type) {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,descripcion,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;`,
        [`%${type}%`]
      );
    } else if (date_init && date_end) {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,descripcion,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE (fecha_registro >=  ? AND  fecha_registro <  ?) ORDER BY fecha_registro DESC
        ;`,
        [
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else {
      result = await connection.query(
        `SELECT i.id,i.servicios_id,i.usuarios_id,i.descripcion,i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.id = i.id) AS valoracion, (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = i.id) AS fecha_registro_valoracion FROM incidencias i ORDER BY fecha_registro DESC`
      );
    }

    const [entries] = result;

    if (!entries.length) {
      throw generateError(
        'No hemos encontrado ninguna incidencia que se ajuste a los parámetros indicados',
        400
      );
    }

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

module.exports = searchIncidences;
