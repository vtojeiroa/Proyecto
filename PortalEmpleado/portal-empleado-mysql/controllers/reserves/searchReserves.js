'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB, generateError } = require('../../helpers');

// GET - /RESERVES
async function searchReserves(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { headquarter, type, date_init, date_end } = req.query;

    let result;

    if (headquarter && type && date_init && date_end) {
      result = await connection.query(
        `SELECT (select s.tipo from servicios s where s.id = r.servicios_id) as tipo, r.fecha_hora_inicio_reserva, r.fecha_hora_fin_reserva,  r.motivo_reserva,  r.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM reservas r LEFT JOIN valoraciones v ON v.incidencias_id=r.id  WHERE r.usuarios_id IN (SELECT u.id FROM usuarios u WHERE u.sedes_id IN 
            (SELECT d.id FROM sedes d WHERE  d.nombre LIKE ?)) AND (r.servicios_id = (SELECT s.id FROM servicios s WHERE s.tipo LIKE ?))  AND (r.fecha_hora_inicio_reserva >=  ? AND  r.fecha_hora_inicio_reserva <  ?)
             ORDER BY r.fecha_hora_inicio_reserva DESC;`,
        [
          `%${headquarter}%`,
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter && type) {
      result = await connection.query(
        `SELECT (select s.tipo from servicios s where s.id = r.servicios_id) as tipo,  r.fecha_hora_inicio_reserva, r.fecha_hora_fin_reserva,  r.motivo_reserva,  r.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM reservas r LEFT JOIN valoraciones v ON v.incidencias_id=r.id  WHERE r.usuarios_id IN (SELECT u.id FROM usuarios u WHERE u.sedes_id IN 
            (SELECT d.id FROM sedes d WHERE  d.nombre LIKE ?)) AND (r.servicios_id = (SELECT s.id FROM servicios s WHERE s.tipo LIKE ?)) ORDER BY r.fecha_hora_inicio_reserva DESC;`,

        [`%${headquarter}%`, `%${type}%`]
      );
    } else if (type && date_init && date_end) {
      result = await connection.query(
        `SELECT (select s.tipo from servicios s where s.id = r.servicios_id) as tipo,  r.fecha_hora_inicio_reserva, r.fecha_hora_fin_reserva,  r.motivo_reserva,  r.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM reservas r LEFT JOIN valoraciones v ON v.incidencias_id=r.id  WHERE (r.servicios_id = (SELECT s.id FROM servicios s WHERE s.tipo LIKE ?))
          AND (r.fecha_hora_inicio_reserva >=  ? AND  r.fecha_hora_inicio_reserva <  ?) ORDER BY r.fecha_hora_inicio_reserva DESC;`,

        [
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter && date_init && date_end) {
      result = await connection.query(
        `SELECT (select s.tipo from servicios s where s.id = r.servicios_id) as tipo, r.fecha_hora_inicio_reserva, r.fecha_hora_fin_reserva,  r.motivo_reserva,  r.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM reservas r LEFT JOIN valoraciones v ON v.incidencias_id=r.id  WHERE r.usuarios_id IN (SELECT u.id FROM usuarios u WHERE u.sedes_id IN
         (SELECT d.id FROM sedes d WHERE d.nombre LIKE ?)) AND (r.fecha_hora_inicio_reserva >=  ? AND  r.fecha_hora_inicio_reserva <  ?)  ORDER BY r.fecha_hora_inicio_reserva DESC;`,

        [
          `%${headquarter}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter) {
      result = await connection.query(
        `SELECT (select s.tipo from servicios s where s.id = r.servicios_id) as tipo,   r.fecha_hora_inicio_reserva, r.fecha_hora_fin_reserva,  r.motivo_reserva,  r.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM reservas r LEFT JOIN valoraciones v ON v.incidencias_id=r.id  WHERE r.usuarios_id IN (SELECT u.id FROM usuarios u WHERE u.sedes_id IN
         (SELECT d.id FROM sedes d WHERE d.nombre LIKE ?))  ORDER BY r.fecha_hora_inicio_reserva DESC;`,

        [`%${headquarter}%`]
      );
    } else if (type) {
      result = await connection.query(
        `SELECT (select s.tipo from servicios s where s.id = r.servicios_id) as tipo,  r.fecha_hora_inicio_reserva, r.fecha_hora_fin_reserva,  r.motivo_reserva,  r.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM reservas r LEFT JOIN valoraciones v ON v.incidencias_id=r.id   WHERE (r.servicios_id = (SELECT s.id FROM servicios s WHERE s.tipo LIKE ?)) ORDER BY r.fecha_hora_inicio_reserva DESC;`,

        [`%${type}%`]
      );
    } else if (date_init && date_end) {
      result = await connection.query(
        `SELECT (select s.tipo from servicios s where s.id = r.servicios_id) as tipo,   r.fecha_hora_inicio_reserva, r.fecha_hora_fin_reserva,  r.motivo_reserva,  r.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM reservas r LEFT JOIN valoraciones v ON v.incidencias_id=r.id  WHERE (r.fecha_hora_inicio_reserva >=  ? AND  r.fecha_hora_inicio_reserva <  ?) ORDER BY r.fecha_hora_inicio_reserva DESC;`,
        [
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else {
      result = await connection.query(
        `SELECT (select s.tipo from servicios s where s.id = r.servicios_id) as tipo,  r.fecha_hora_inicio_reserva, r.fecha_hora_fin_reserva,  r.motivo_reserva,  r.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM reservas r LEFT JOIN valoraciones v ON v.incidencias_id=r.id  ORDER BY r.fecha_hora_inicio_reserva DESC;`
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

module.exports = searchReserves;
