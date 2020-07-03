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
        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro as fecha_valoracion FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id WHERE i.usuarios_id IN (SELECT u.id FROM usuarios u WHERE u.sedes_id IN 
          (SELECT d.id FROM sedes d WHERE d.nombre LIKE ?))  AND (i.servicios_id = (SELECT s.id FROM servicios s WHERE s.tipo LIKE ?))  AND (i.fecha_registro >=  ? AND  i.fecha_registro <  ?) ORDER BY i.fecha_registro DESC;`,

        [
          `%${headquarter}%`,
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter && type) {
      result = await connection.query(
        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro as fecha_valoracion FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id  WHERE i.usuarios_id IN (SELECT u.id FROM usuarios u WHERE u.sedes_id IN
           (SELECT d.id FROM sedes d WHERE d.nombre LIKE ?)) AND (i.servicios_id = (SELECT s.id FROM servicios s WHERE s.tipo LIKE ?)) ORDER BY i.fecha_registro DESC;`,

        [`%${headquarter}%`, `%${type}%`]
      );
    } else if (type && date_init && date_end) {
      result = await connection.query(
        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro as fecha_valoracion FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id   WHERE (i.servicios_id = (SELECT d.id FROM servicios d WHERE d.tipo LIKE ?))
          AND (i.fecha_registro >=  ? AND  i.fecha_registro <  ?) ORDER BY i.fecha_registro DESC;`,

        [
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter && date_init && date_end) {
      result = await connection.query(
        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro as fecha_valoracion FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id  WHERE i.usuarios_id IN (SELECT u.id FROM usuarios u WHERE u.sedes_id IN 
          (SELECT d.id FROM sedes d WHERE d.nombre LIKE ?)) AND (i.fecha_registro >=  ? AND  i.fecha_registro <  ?) ORDER BY i.fecha_registro DESC;`,

        [
          `%${headquarter}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter) {
      result = await connection.query(
        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro as fecha_valoracion FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id   WHERE i.usuarios_id IN (SELECT u.id FROM usuarios u WHERE u.sedes_id IN
           (SELECT d.id FROM sedes d WHERE d.nombre LIKE ?))  ORDER BY i.fecha_registro DESC;`,

        [`%${headquarter}%`]
      );
    } else if (type) {
      result = await connection.query(
        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro as fecha_valoracion FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id WHERE (i.servicios_id = (SELECT s.id FROM servicios s WHERE s.tipo LIKE ?)) ORDER BY i.fecha_registro DESC;`,

        [`%${type}%`]
      );
    } else if (date_init && date_end) {
      result = await connection.query(
        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id WHERE (i.fecha_registro >=  ? AND  i.fecha_registro <  ?) ORDER BY i.fecha_registro DESC;`,

        [
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else {
      result = await connection.query(
        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro as fecha_valoracion FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id  ORDER BY i.fecha_registro DESC;`
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
