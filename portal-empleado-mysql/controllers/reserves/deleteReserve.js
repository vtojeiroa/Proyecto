'use strict';

const { getConnection } = require('../../db');
const {
  formatDateToDB,
  /*      sendEmail,
      randomString, */

  generateError
} = require('../../helpers');

/*  const {
    reserveSchema,
       voteSchema, 
    searchSchema,
     editReserveSchema  
} = require('../validations');  */

// DELETE - /RESERVES/: id
async function deleteReserve(req, res, next) {
  let connection;
  try {
    const { id } = req.params;

    connection = await getConnection();

    // Delete incidence and vote if exists!
    const [
      current
    ] = await connection.query('SELECT * FROM reservas WHERE id=?', [id]);

    if (!current.length) {
      throw generateError(`No hay ninguna reserva con el número ${id}`, 400);
    }

    const [data] = current;
    const date = formatDateToDB(new Date());

    if (
      data.usuarios_id === req.auth.id &&
      date >= formatDateToDB(new Date(data.fecha_hora_inicio_reserva))
    ) {
      throw generateError(
        `No tienes permiso para borrar la reserva ${id},la hora de inicio de la reserva ya ha pasado `,
        403
      );
    } else if (
      (data.usuarios_id === req.auth.id &&
        date < formatDateToDB(new Date(data.fecha_hora_inicio_reserva))) ||
      req.auth.role === 'admin'
    ) {
      await connection.query('DELETE FROM valoraciones WHERE reservas_id=?', [
        id
      ]);
      await connection.query('DELETE FROM reservas WHERE id=?', [id]);
    } /*  else if (req.auth.role === 'admin') {
      await connection.query('DELETE FROM valoraciones WHERE reservas_id=?', [
        id
      ]);
      await connection.query('DELETE FROM reservas WHERE id=?', [id]);
    } */ else {
      throw generateError(
        `No tienes permiso para borrar la reserva ${id}`,
        403
      );
    }

    res.send({
      status: 'ok',
      message: `La reserva con el número ${id} ha sido borrada`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteReserve;
