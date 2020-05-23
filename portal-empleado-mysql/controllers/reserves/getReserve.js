'use strict';

const { getConnection } = require('../../db');
const {
  /* formatDateToDB,
    sendEmail,
    randomString, */
  generateError
} = require('../../helpers');

/* const {
    reserveSchema,
       voteSchema, 
    searchSchema,
     editReserveSchema  
} = require('../validations'); */

// GET - /RESERVES/:id
async function getReserve(req, res, next) {
  let connection;
  try {
    const { id } = req.params;
    const { number } = req.query;

    connection = await getConnection();

    let result;
    /*     const existsNumber = await connection.query(
      `SELECT id, codigo_reserva FROM reservas WHERE codigo_reserva = ? `,
      [number]
    ); */
    if (number) {
      /* (!existsNumber) {
      throw generateError(`La incidencia número ${id} no existe`, 404);
    } else if (existsNumber) */ result = await connection.query(
        `SELECT r.id,r.servicios_id, r.usuarios_id, r.fecha_registro,
          r.fecha_hora_inicio_reserva, r.fecha_hora_fin_reserva ,r.motivo_reserva, 
          v.valoracion, v.comentario_valoracion
          FROM reservas r
          LEFT JOIN valoraciones v
          ON r.id = v.servicios_id
          WHERE r.codigo_reserva = ? `,
        [number]
      );
    } else {
      result = await connection.query(
        `SELECT r.id,r.servicios_id, r.usuarios_id, r.fecha_registro, 
          r.fecha_hora_inicio_reserva, r.fecha_hora_fin_reserva ,r.motivo_reserva,
           v.valoracion, v.comentario_valoracion
          FROM reservas r
          LEFT JOIN valoraciones v
          ON r.id = v.servicios_id
          WHERE r.id = ? 
          `,
        [id]
      );
    }
    const [data] = result;

    if (!data[0]) {
      throw generateError(`La reserva número ${id} no existe`, 404);
    }

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

module.exports = getReserve;
