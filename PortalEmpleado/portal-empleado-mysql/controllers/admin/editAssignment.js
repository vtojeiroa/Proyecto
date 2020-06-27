'use strict';

const { getConnection } = require('../../db');

const { createAssignmentSchema } = require('../validations');

const { generateError } = require('../../helpers');

// PUT - /Assignment
async function editAssignment(req, res, next) {
  let connection;

  try {
    await createAssignmentSchema.validateAsync(req.body);

    const { id } = req.params;

    const { disponibility } = req.body;

    connection = await getConnection();
    const [
      current
    ] = await connection.query(
      `SELECT sedes_id, servicios_id, disponibilidad_servicios, fecha_registro FROM sedes_servicios WHERE id = ?`,
      [id]
    );

    if (!current.length) {
      throw generateError(
        'La asignación que indica no existe en la base de datos',
        404
      );
    }

    await connection.query(
      `UPDATE sedes_servicios ss SET  ss.disponibilidad_servicios = ? WHERE
       id = ?`,
      [disponibility, id]
    );

    res.send({
      status: 'ok',
      message: `Acabas de modificar el servicio ${id} en el Portal del Empleado`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editAssignment;
