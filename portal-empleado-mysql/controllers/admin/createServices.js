'use strict';

const { getConnection } = require('../../db');

const { createServiceSchema } = require('../validations');

// POST - /services
async function createServices(req, res, next) {
  let connection;
  //Meterlos en la base de datos
  try {
    await createServiceSchema.validateAsync(req.body);

    const { section, type, description } = req.body;

    connection = await getConnection();

    const [result] = await connection.query(
      `INSERT INTO servicios(activo,seccion, tipo, descripcion)
        VALUES(?, ?, ?, ?)`,
      [1, section, type, description]
    );

    res.send({
      status: 'ok',
      message: `Acabas de registrar un nuevo servicio en el Portal del Empleado`,
      data: {
        id: result.insertId,
        section: result.section,
        type: req.auth.id,
        description: description
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = createServices;
