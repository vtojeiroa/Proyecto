'use strict';

const { getConnection } = require('../../db');
const {
  /*  formatDateToDB,
          sendEmail,
          randomString,  */

  generateError
} = require('../../helpers');

const {
  /*  reserveSchema, */
  voteSchema
  /*  searchSchema,
     editReserveSchema   */
} = require('../validations');

// POST - /incidences /: id / vote
async function voteIncidence(req, res, next) {
  let connection;
  try {
    const { id } = req.params;
    /* const { code } = req.query; */
    const userId = req.auth.id;

    // Validate payload
    await voteSchema.validateAsync(req.body);

    const { vote, description } = req.body;

    connection = await getConnection();

    // Check if the current incidence  exists
    const [
      entry
    ] = await connection.query(
      'SELECT id, servicios_id, usuarios_id, activo,codigo_incidencia FROM incidencias WHERE id=?',
      [id]
    );
    const [dataEntry] = entry;
    if (!entry.length) {
      throw generateError(`La incidencia con el número ${id} no existe`, 404);
    }
    // Check if the incidence userid === token id actually exists
    if (dataEntry.usuarios_id !== userId) {
      throw generateError(
        `No tienes permisos para votar la incidencia ${id}`,
        403
      );
    }
    // Check if the incidence is active
    if (dataEntry.activo !== 0) {
      throw generateError(
        `La incidencia con el número ${id} no está cerrada`,
        403
      );
    }

    // Check if the user with the current ID already voted for this entry

    if (!dataEntry.codigo_incidencia) {
      throw generateError(`Ya has valorado esta incidencia`, 403);
    }

    //Vote
    await connection.query(
      `
      INSERT INTO valoraciones(incidencias_id,usuarios_id ,servicios_id, valoracion, comentario_valoracion) 
      VALUES(?, ?, ?, ?, ?)`,
      [id, dataEntry.usuarios_id, dataEntry.servicios_id, vote, description]
    );

    // Delete voteCode from table usuarios

    await connection.query(
      'UPDATE incidencias SET codigo_incidencia=NULL WHERE id=?',
      [id]
    );

    res.send({
      status: 'ok',
      message: `El voto de ${vote} puntos para la incidencia con id ${id} se ha realizado con éxito`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = voteIncidence;
