'use strict';

const { getConnection } = require('../../db');
const { generateError } = require('../../helpers');

// GET - /reserves/:code
async function getReserveByCode(req, res, next) {
  let connection;
  try {
    const { code } = req.params;

    console.log(code);
    connection = await getConnection();

    if (!code) {
      throw generateError(`No ha indicado ningún código de reserva`, 404);
    }

    const existData = await connection.query(
      `SELECT id,usuarios_id, codigo_reserva FROM reservas WHERE codigo_reserva = ?`,
      [code]
    );
    const [dataId] = existData;

    if (!dataId.length) {
      throw generateError(`La reserva con el código ${code} no existe`, 404);
    }

    let result = await connection.query(
      `select id,servicios_id, usuarios_id, fecha_hora_inicio_reserva,fecha_hora_fin_reserva, motivo_reserva, fecha_registro FROM reservas WHERE codigo_reserva = ?  GROUP BY id`,
      [code]
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

module.exports = getReserveByCode;
