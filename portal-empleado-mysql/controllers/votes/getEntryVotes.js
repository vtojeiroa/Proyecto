'use strict';

const { getConnection } = require('../../db');
const {
  /*  formatDateToDB,
        sendEmail,
        randomString,  */

  generateError
} = require('../../helpers');

/*  const {
    reserveSchema,
       voteSchema, 
    searchSchema,
     editReserveSchema  
} = require('../validations');  */

//GET - /RESERVES/votes
async function getEntryVotes(req, res, next) {
  let connection;
  try {
    const { serviceType } = req.body;
    connection = await getConnection();

    const [
      data
    ] = await connection.query(
      `SELECT id,tipo,seccion FROM servicios WHERE tipo LIKE ?`,
      [`%${serviceType}%`]
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
        'SELECT i.descripcion, v.servicios_id,  v.valoracion,  v.comentario_valoracion, v.valoracion, v.valoracion FROM valoraciones v  INNER JOIN incidencias i ON  i.id = v.incidencias_id  WHERE v.servicios_id=? ',
        [serviceId.id]
      );
    } else {
      [
        votes
      ] = await connection.query(
        'SELECT (SELECT tipo FROM servicios WHERE id =? ) AS service, v.servicios_id,  v.valoracion,  v.comentario_valoracion, v.valoracion, v.valoracion FROM valoraciones v  INNER JOIN reservas r ON  v.reservas_id = r.id  WHERE v.servicios_id=? ',
        [serviceId.id, serviceId.id]
      );
    }

    const [
      avgVotes
    ] = await connection.query(
      'SELECT AVG(valoracion) AS avgvotes FROM valoraciones WHERE servicios_id=? ',
      [serviceId.id]
    );
    const [average] = avgVotes;

    res.send({
      status: 'ok',
      serviceType: serviceId.tipo,
      average_votes: average.avgvotes,
      data: votes
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getEntryVotes;
