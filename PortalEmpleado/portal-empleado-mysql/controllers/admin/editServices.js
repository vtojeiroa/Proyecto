'use strict';

const { getConnection } = require('../../db');

const { editServiceSchema } = require('../validations');

const { generateError } = require('../../helpers');

// PUT - /services
async function editServices(req, res, next) {
  let connection;

  try {
    await editServiceSchema.validateAsync(req.body);

    const { id } = req.params;

    const { active, section, type, description } = req.body;

    connection = await getConnection();
    const [
      current
    ] = await connection.query(
      `SELECT id, seccion, tipo FROM servicios WHERE id = ?`,
      [id]
    );

    if (!current.length) {
      throw generateError(
        'El servico que indica no existe en la base de datos',
        404
      );
    }

    await connection.query(
      `UPDATE servicios SET activo = ?, seccion = ?, tipo = ?, descripcion = ? WHERE
       id = ?`,
      [active, section, type, description, id]
    );

    res.send({
      status: 'ok',
      message: `Acabas de modificar el servicio ${id} en el Portal del Empleado`,
      data: {
        id: id,
        active: active,
        section: section,
        type: type,
        description: description
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editServices;
