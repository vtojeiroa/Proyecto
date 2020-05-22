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
} = require('../validations');  */

//GET - /RESERVES/votes
async function entryVotesReserve(req, res, next) {
  let connection;
  try {
    const { reserveType } = req.body;
    connection = await getConnection();

    const [
      dataReserve
    ] = await connection.query(
      `SELECT id,tipo FROM servicios WHERE tipo LIKE ?`,
      [`%${reserveType}%`]
    );

    if (!dataReserve.length) {
      throw generateError(
        'El tipo de incedencia que indica no existe en la base de datos',
        404
      );
    }
    let [reserveId] = dataReserve;

    const [
      votes
    ] = await connection.query(
      'SELECT i.descripcion, v.servicios_id,  v.valoracion,  v.comentario_valoracion, v.valoracion, v.valoracion FROM valoraciones v  INNER JOIN incidencias i ON  i.id = v.incidencias_id  WHERE v.servicios_id=? ',
      [reserveId.id]
    );
    const [
      avgVotes
    ] = await connection.query(
      'SELECT AVG(valoracion) AS avgvotes FROM valoraciones WHERE servicios_id=? ',
      [reserveId.id]
    );
    const [average] = avgVotes;
    console.log(average);
    res.send({
      status: 'ok',
      incidence_type: reserveId.tipo,
      average_votes: average.avgvotes,
      data: votes
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = entryVotesReserve;
