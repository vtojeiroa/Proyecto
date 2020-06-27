'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB, generateError } = require('../../helpers');

const { searchSchema } = require('../validations');

// GET - /INCIDENCES
async function listReserves(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const userId = req.auth.id;

    const { dateEndReserve, type, date_init, date_end } = req.query;

    let result;

    if (dateEndReserve && type && date_init && date_end) {
      result = await connection.query(
        `SELECT id,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo ,
        usuarios_id,fecha_hora_inicio_reserva,fecha_hora_fin_reserva, motivo_reserva,codigo_reserva,fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.reservas_id = r.id) AS valoracion ,
         (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.reservas_id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.reservas_id = r.id) AS fecha_registro_valoracion 
          FROM reservas r WHERE usuarios_id = ? AND fecha_hora_inicio_reserva >= ? AND (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) AND (fecha_registro >=  ? AND  fecha_registro <=  ?)  
         ORDER BY fecha_registro DESC;`,
        [
          userId,
          dateEndReserve,
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (dateEndReserve && type) {
      result = await connection.query(
        `SELECT id,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo ,
        usuarios_id,fecha_hora_inicio_reserva,fecha_hora_fin_reserva, motivo_reserva,codigo_reserva,fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.reservas_id = r.id) AS valoracion ,
         (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.reservas_id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.reservas_id = r.id) AS fecha_registro_valoracion 
          FROM reservas r WHERE usuarios_id = ? AND fecha_hora_inicio_reserva >= ? AND (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;`,
        [userId, dateEndReserve, `%${type}%`]
      );
    } else if (dateEndReserve && date_init && date_end) {
      result = await connection.query(
        `SELECT id,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo ,usuarios_id,fecha_hora_inicio_reserva,fecha_hora_fin_reserva,
         motivo_reserva,codigo_reserva,fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.reservas_id = r.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.reservas_id = r.id) AS comentario_valoracion,
          (SELECT v.fecha_registro FROM valoraciones v WHERE v.reservas_id = r.id) AS fecha_registro_valoracion  FROM reservas r WHERE usuarios_id = ? AND fecha_hora_inicio_reserva >= ? AND (fecha_registro >=  ? AND  fecha_registro <=  ?) ORDER BY fecha_registro DESC;`,
        [
          userId,
          dateEndReserve,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (type && date_init && date_end) {
      result = await connection.query(
        `SELECT id, (select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo , usuarios_id, fecha_hora_inicio_reserva,
         fecha_hora_fin_reserva, motivo_reserva,codigo_reserva, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.reservas_id = r.id) AS valoracion, (SELECT v.comentario_valoracion
           FROM valoraciones v WHERE v.reservas_id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.reservas_id = r.id) AS fecha_registro_valoracion 
            FROM reservas r WHERE usuarios_id = ? AND(servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) AND(fecha_registro >=  ? AND  fecha_registro <=  ?)
       ORDER BY fecha_registro DESC;`,
        [
          userId,
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (dateEndReserve) {
      await searchSchema.validateAsync(dateEndReserve);

      result = await connection.query(
        `SELECT id,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo ,usuarios_id,fecha_hora_inicio_reserva,
        fecha_hora_fin_reserva, motivo_reserva,codigo_reserva,fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.reservas_id = r.id) AS valoracion , (SELECT v.comentario_valoracion
           FROM valoraciones v WHERE v.reservas_id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.reservas_id = r.id) AS fecha_registro_valoracion 
            FROM reservas r WHERE usuarios_id = ? AND fecha_hora_inicio_reserva >= ? ORDER BY fecha_registro DESC;`,
        [userId, dateEndReserve]
      );
    } else if (type) {
      await searchSchema.validateAsync(type);

      result = await connection.query(
        `SELECT id,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo ,usuarios_id,fecha_hora_inicio_reserva,
        fecha_hora_fin_reserva, motivo_reserva,codigo_reserva,fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.reservas_id = r.id) AS valoracion , (SELECT v.comentario_valoracion 
          FROM valoraciones v WHERE v.reservas_id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.reservas_id = r.id) AS fecha_registro_valoracion 
           FROM reservas r WHERE usuarios_id = ? AND (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;`,
        [userId, `%${type}%`]
      );
    } else if (date_init && date_end) {
      result = await connection.query(
        `SELECT id, (select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo , usuarios_id, fecha_hora_inicio_reserva,
         fecha_hora_fin_reserva, motivo_reserva,codigo_reserva, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.reservas_id = r.id) AS valoracion, (SELECT v.comentario_valoracion
           FROM valoraciones v WHERE v.reservas_id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.reservas_id = r.id) AS fecha_registro_valoracion 
            FROM reservas r WHERE usuarios_id = ? AND(fecha_registro >=  ? AND  fecha_registro <=  ?)
       ORDER BY fecha_registro DESC;`,
        [
          userId,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else {
      result = await connection.query(
        `SELECT id,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo ,usuarios_id, fecha_hora_inicio_reserva,
        fecha_hora_fin_reserva, motivo_reserva,codigo_reserva,fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.reservas_id = r.id) AS valoracion , (SELECT v.comentario_valoracion 
          FROM valoraciones v WHERE v.reservas_id = r.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.reservas_id = r.id) AS fecha_registro_valoracion 
           FROM reservas r WHERE usuarios_id = ? ORDER BY fecha_registro DESC;`,
        [userId]
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

module.exports = listReserves;
