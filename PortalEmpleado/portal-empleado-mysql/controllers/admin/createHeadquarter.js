'use strict';

const { getConnection } = require('../../db');

const { createHeadquarterSchema } = require('../validations');

// POST - /Sedes
async function createHeadquarter(req, res, next) {
  let connection;

  try {
    await createHeadquarterSchema.validateAsync(req.body);

    const {
      name,
      address,
      postal_code,
      location,
      province,
      country
    } = req.body;

    connection = await getConnection();

    const [result] = await connection.query(
      `INSERT INTO sedes(activo,nombre, direccion,codigo_postal,localidad,provincia,pais)
        VALUES(?, ?, ?, ?,?,?,?)`,
      [1, name, address, postal_code, location, province, country]
    );

    res.send({
      status: 'ok',
      message: `Acabas de registrar una nueva sede en el Portal del Empleado`,
      data: {
        id: result.insertId,
        name: name,
        address: address,
        postal_code: postal_code,
        location: location,
        province: province,
        country: country
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = createHeadquarter;
