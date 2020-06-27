'use strict';

const { getConnection } = require('../../db');
const { generateError } = require('../../helpers');

// DELETE - /INCIDENCES/:id
async function deleteIncidence(req, res, next) {
  let connection;
  try {
    const { id } = req.params;
    const roleId = req.auth.role;

    connection = await getConnection();

    // Delete incidence and vote if exists!
    const [
      current
    ] = await connection.query('SELECT * FROM incidencias WHERE id=?', [id]);

    if (!current.length) {
      throw generateError(`No hay ninguna incidencia con el número ${id}`, 400);
    }
    const [data] = current;
    if (roleId === 'admin') {
      await connection.query(
        'DELETE FROM valoraciones WHERE incidencias_id=?',
        [id]
      );
      await connection.query('DELETE FROM incidencias WHERE id=?', [id]);
    } else {
      if (data.activo === 0) {
        throw generateError(
          `la incidencia número ${id} no se puede borrar, ya ha sido gestionada`,
          409
        );
      }

      await connection.query(
        'DELETE FROM valoraciones WHERE incidencias_id=?',
        [id]
      );
      await connection.query('DELETE FROM incidencias WHERE id=?', [id]);
    }
    res.send({
      status: 'ok',
      message: `La incidencia con el número ${id} ha sido borrada`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteIncidence;
