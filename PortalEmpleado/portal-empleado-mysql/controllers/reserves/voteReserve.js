'use strict';

const { getConnection } = require('../../db');
const {
  formatDateToDB,

  generateError
} = require('../../helpers');

const { voteSchema } = require('../validations');

// POST - /RESERVES/:id/vote
async function voteReserve(req, res, next) {
  let connection;
  try {
    const { id } = req.params;
    const userId = req.auth.id;
    const date = formatDateToDB(new Date());

    // Validate payload
    await voteSchema.validateAsync(req.body);

    const { vote, description } = req.body;

    connection = await getConnection();

    // Check if the reserve actually exists

    const [
      entry
    ] = await connection.query(
      'SELECT id, servicios_id, usuarios_id,codigo_reserva, fecha_hora_fin_reserva FROM reservas WHERE id=?',
      [id]
    );
    const [dataEntry] = entry;
    if (!entry.length) {
      throw generateError(`La reserva con el número ${id} no existe`, 404);
    }
    // Check if the reserve userid === token id actually exists
    if (dataEntry.usuarios_id !== userId) {
      throw generateError(
        `No tienes permisos para votar la reserva ${id}`,
        403
      );
    }

    // Check if the reservation has finished
    if (date < formatDateToDB(new Date(dataEntry.fecha_hora_fin_reserva))) {
      throw generateError(
        `La reserva con el número ${id} no ha finalizado`,
        403
      );
    }

    // Check if the user with the current ID already voted for this entry

    if (!dataEntry.codigo_reserva) {
      throw generateError(`Ya has valorado esta reserva`, 403);
    }

    //Vote
    await connection.query(
      `
      INSERT INTO valoraciones(reservas_id,usuarios_id ,servicios_id, valoracion, comentario_valoracion) 
      VALUES(?, ?, ?, ?, ?)`,
      [id, dataEntry.usuarios_id, dataEntry.servicios_id, vote, description]
    );

    // Delete voteCode from table usuarios

    await connection.query(
      `UPDATE reservas SET codigo_reserva='close' WHERE id=?`,
      [id]
    );

    res.send({
      status: 'ok',
      message: `El voto de ${vote} puntos para la reserva ${id} se ha realizado con éxito`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = voteReserve;
