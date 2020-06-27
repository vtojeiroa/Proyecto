'use strict';

const { getConnection } = require('../../db');
const { generateError } = require('../../helpers');

//GET - /VOTES

async function getEntryVotes(req, res, next) {
  let connection;
  try {
    const { type } = req.query;
    connection = await getConnection();

    const [
      data
    ] = await connection.query(
      `SELECT id,tipo,seccion FROM servicios WHERE tipo LIKE ?`,
      [`%${type}%`]
    );

    if (!data.length) {
      throw generateError(
        'El tipo de servicio que indica no existe en la base de datos',
        404
      );
    }
    let [serviceId] = data;

    let votes;

    if (serviceId.seccion === 'Incidencia') {
      [
        votes
      ] = await connection.query(
        'SELECT i.descripcion, v.servicios_id,  v.valoracion,  v.comentario_valoracion, v.fecha_registro  FROM valoraciones v  INNER JOIN incidencias i ON  i.id = v.incidencias_id  WHERE v.servicios_id=? ',
        [serviceId.id]
      );
    } else {
      [votes] = await connection.query(
        `SELECT (SELECT tipo FROM servicios WHERE id =? ) AS servicio, v.servicios_id,  v.valoracion,  v.comentario_valoracion, v.fecha_registro FROM valoraciones v  INNER JOIN reservas r ON  v.reservas_id = r.id 
         WHERE v.servicios_id=? `,
        [serviceId.id, serviceId.id]
      );
    }

    let avgVotes;

    [
      avgVotes
    ] = await connection.query(
      'SELECT AVG(valoracion) AS avgvotes, COUNT(valoracion) AS totalvotes FROM valoraciones WHERE servicios_id=? ',
      [serviceId.id]
    );

    res.send({
      status: 'ok',

      data: votes,
      average: avgVotes,
      values: { service: serviceId.seccion, type: serviceId.tipo }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getEntryVotes;
