'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB } = require('../../helpers');

const { searchSchema } = require('../validations');

// GET - /INCIDENCES
async function listReservesValorations(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { headquarter, type_reserve, date_init, date_end } = req.query;

    let result;

    if (headquarter && type_reserve) {
      result = await connection.query(
        `SELECT r.id,r.servicios_id,r.usuarios_id,r.fecha_hora_inicio_reserva,r.fecha_hora_fin_reserva, r.motivo_reserva,r.fecha_registro,
        v.valoracion, v.comentario_valoracion FROM reservas r INNER JOIN valoraciones v ON r.id = v.incidencias_id WHERE r.usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
      (SELECT id FROM sedes WHERE nombre LIKE ?)) AND (r.servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;`,
        [`%${headquarter}%`, `%${type_reserve}%`]
      );
    } else if (headquarter) {
      await searchSchema.validateAsync(headquarter);

      result = await connection.query(
        `SELECT r.id,r.servicios_id,r.usuarios_id,r.fecha_hora_inicio_reserva,r.fecha_hora_fin_reserva, r.motivo_reserva,r.fecha_registro,
        v.valoracion, v.comentario_valoracion FROM reservas r INNER JOIN valoraciones v ON r.id = v.incidencias_id WHERE r.usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
        (SELECT id FROM sedes WHERE nombre LIKE ?)) ORDER BY r.fecha_registro DESC;`,
        [`%${headquarter}%`]
      );
    } else if (type_reserve) {
      await searchSchema.validateAsync(type_reserve);

      result = await connection.query(
        `SELECT r.id,r.servicios_id,r.usuarios_id,r.fecha_hora_inicio_reserva,r.fecha_hora_fin_reserva, r.motivo_reserva,r.fecha_registro,
        v.valoracion, v.comentario_valoracion FROM reservas r 
        , valoraciones v WHERE  r.id = v.reservas_id AND (r.servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY r.fecha_registro DESC;`,
        [`%${type_reserve}%`]
      );
    } else if (date_init && date_end) {
      result = await connection.query(
        `SELECT r.id,r.servicios_id,r.usuarios_id,r.fecha_hora_inicio_reserva,r.fecha_hora_fin_reserva, r.motivo_reserva, r.fecha_registro,
        v.valoracion, v.comentario_valoracion FROM reservas r 
        , valoraciones v WHERE  r.id = v.reservas_id  AND (r.fecha_registro >=  ? AND  r.fecha_registro <  ?) ORDER BY r.fecha_registro DESC
        ;`,
        [
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else {
      result = await connection.query(
        `SELECT r.id,r.servicios_id,r.usuarios_id,r.fecha_hora_inicio_reserva,r.fecha_hora_fin_reserva, r.motivo_reserva, r.fecha_registro,
        v.valoracion, v.comentario_valoracion FROM reservas r 
        , valoraciones v WHERE  r.id = v.reservas_id 
        ORDER BY r.fecha_registro DESC`
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

module.exports = listReservesValorations;
