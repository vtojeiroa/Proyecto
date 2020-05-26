'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB, generateError } = require('../../helpers');

// GET - /INCIDENCES
async function searchReserves(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { headquarter, type, date_init, date_end } = req.query;

    let result;

    if (headquarter && type && date_init && date_end) {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,fecha_hora_inicio_reserva,fecha_hora_fin_reserva, motivo_reserva, fecha_registro , (SELECT v.valoracion FROM valoraciones v WHERE v.id = r.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = r.id) AS fecha_registro_valoracion FROM reservas r WHERE r.usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
      (SELECT id FROM sedes WHERE nombre LIKE ?)) AND (r.servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) AND (r.fecha_registro >=  ? AND r.fecha_registro <  ?)  ORDER BY fecha_registro DESC;`,
        [
          `%${headquarter}%`,
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter && type) {
      result = await connection.query(
        `SELECT r.id,r.servicios_id,r.usuarios_id,r.fecha_hora_inicio_reserva,r.fecha_hora_fin_reserva,r.motivo_reserva,r.fecha_registro , (SELECT v.valoracion FROM valoraciones v WHERE v.id = r.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = r.id) AS fecha_registro_valoracion   FROM reservas r  WHERE r.usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
      (SELECT id FROM sedes WHERE nombre LIKE ?)) AND (r.servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY r.fecha_registro DESC;`,
        [`%${headquarter}%`, `%${type}%`]
      );
    } else if (headquarter && date_init && date_end) {
      result = await connection.query(
        `SELECT r.id,r.servicios_id,r.usuarios_id,r.fecha_hora_inicio_reserva,r.fecha_hora_fin_reserva,r.motivo_reserva,r.fecha_registro , (SELECT v.valoracion FROM valoraciones v WHERE v.id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = i.id) AS fecha_registro_valoracion  FROM reservas r WHERE r.usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
      (SELECT id FROM sedes WHERE nombre LIKE ?)) AND (r.fecha_registro >=  ? AND  r.fecha_registro <  ?)  ORDER BY r.fecha_registro DESC;`,
        [
          `%${headquarter}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (type && date_init && date_end) {
      result = await connection.query(
        `SELECT r.id,r.servicios_id,r.usuarios_id,r.fecha_hora_inicio_reserva,fecha_hora_fin_reserva, r.motivo_reserva, r.fecha_registro ,(SELECT v.valoracion FROM valoraciones v WHERE v.id = r.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = r.id) AS fecha_registro_valoracion  FROM reservas r WHERE (r.servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) AND (r.fecha_registro >=  ? AND  r.fecha_registro <  ?)  ORDER BY r.fecha_registro DESC;`,
        [
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter) {
      result = await connection.query(
        `SELECT r.id,r.servicios_id,r.usuarios_id,r.fecha_hora_inicio_reserva,r.fecha_hora_fin_reserva,r.motivo_reserva, r.fecha_registro , (SELECT v.valoracion FROM valoraciones v WHERE v.id = r.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = r.id) AS fecha_registro_valoracion   FROM reservas r  WHERE r.usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
        (SELECT id FROM sedes WHERE nombre LIKE ?)) ORDER BY r.fecha_registro DESC;`,
        [`%${headquarter}%`]
      );
    } else if (type) {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,fecha_hora_inicio_reserva,fecha_hora_fin_reserva, motivo_reserva, fecha_registro , (SELECT v.valoracion FROM valoraciones v WHERE v.id = r.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = r.id) AS fecha_registro_valoracion   FROM reservas r  WHERE (r.servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY r.fecha_registro DESC;`,
        [`%${type}%`]
      );
    } else if (date_init && date_end) {
      result = await connection.query(
        `SELECT r.id,r.servicios_id,r.usuarios_id,r.fecha_hora_inicio_reserva,r.fecha_hora_fin_reserva,r.motivo_reserva, r.fecha_registro , (SELECT v.valoracion FROM valoraciones v WHERE v.id = r.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = r.id) AS fecha_registro_valoracion   FROM reservas r  WHERE (r.fecha_registro >=  ? AND r.fecha_registro <  ?) ORDER BY r.fecha_registro DESC
        ;`,
        [
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else {
      result = await connection.query(
        `SELECT r.id,r.servicios_id,r.usuarios_id,r.fecha_hora_inicio_reserva,r.fecha_hora_fin_reserva,r.motivo_reserva, r.fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.id = r.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = r.id) AS fecha_registro_valoracion  FROM reservas r ORDER BY r.fecha_registro DESC`
      );
    }

    const [entries] = result;
    if (!entries.length) {
      throw generateError(
        'No hemos encontrado ninguna reserva que se ajuste a los parámetros indicados',
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
