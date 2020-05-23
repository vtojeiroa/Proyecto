'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB } = require('../../helpers');

const { searchSchema } = require('../validations');

// GET - /INCIDENCES
async function listReserves(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { headquarter, type_reserve, date_init, date_end } = req.query;

    let result;

    if (headquarter && type_reserve) {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,fecha_hora_inicio_reserva,fecha_hora_fin_reserva, motivo_reserva, fecha_registro FROM reservas WHERE usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
      (SELECT id FROM sedes WHERE nombre LIKE ?)) AND (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;`,
        [`%${headquarter}%`, `%${type_reserve}%`]
      );
    } else if (headquarter) {
      await searchSchema.validateAsync(headquarter);

      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,fecha_hora_inicio_reserva,fecha_hora_fin_reserva, motivo_reserva, fecha_registro FROM reservas WHERE usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN
        (SELECT id FROM sedes WHERE nombre LIKE ?)) ORDER BY fecha_registro DESC;`,
        [`%${headquarter}%`]
      );
    } else if (type_reserve) {
      await searchSchema.validateAsync(type_reserve);

      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,fecha_hora_inicio_reserva,fecha_hora_fin_reserva, motivo_reserva, fecha_registro FROM reservas WHERE (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;`,
        [`%${type_reserve}%`]
      );
    } else if (date_init && date_end) {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,fecha_hora_inicio_reserva,fecha_hora_fin_reserva, motivo_reserva, fecha_registro FROM reservas WHERE (fecha_registro >=  ? AND  fecha_registro <  ?) ORDER BY fecha_registro DESC
        ;`,
        [
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else {
      result = await connection.query(
        `SELECT id,servicios_id,usuarios_id,fecha_hora_inicio_reserva,fecha_hora_fin_reserva, motivo_reserva, fecha_registro FROM reservas ORDER BY fecha_registro DESC`
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

module.exports = listReserves;
