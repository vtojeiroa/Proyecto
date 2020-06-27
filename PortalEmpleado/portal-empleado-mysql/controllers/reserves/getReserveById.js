'use strict';

const { getConnection } = require('../../db');
const { generateError } = require('../../helpers');

// GET - /RESERVES/:id
async function getReserveById(req, res, next) {
  let connection;
  try {
    const { id } = req.params;
    const userId = req.auth.id;

    connection = await getConnection();

    const existData = await connection.query(
      `SELECT id,usuarios_id, codigo_reserva FROM reservas WHERE id = ?`,
      [id]
    );
    const [dataId] = existData;

    if (!dataId.length) {
      throw generateError(`La reserva con el código ${id} no existe`, 404);
    }

    if (dataId[0].usuarios_id !== userId) {
      throw generateError(
        `No tienes permisos para visualizar la reserva ${id}`,
        403
      );
    }

    let result = await connection.query(
      `select id,servicios_id, usuarios_id, fecha_hora_inicio_reserva,fecha_hora_fin_reserva,motivo_reserva,fecha_registro FROM reservas WHERE id = ?  GROUP BY id`,
      [id]
    );

    const [data] = result;

    res.send({
      status: 'ok',
      data: data[0]
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getReserveById;
