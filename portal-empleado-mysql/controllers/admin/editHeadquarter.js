'use strict';

const { getConnection } = require('../../db');

const { editHeadquarterSchema } = require('../validations');

const { generateError } = require('../../helpers');

// PUT - /services
async function editHeadquarter(req, res, next) {
  let connection;
  //Meterlos en la base de datos
  try {
    await editHeadquarterSchema.validateAsync(req.body);

    const { id } = req.params;

    const {
      active,
      name,
      address,
      postal_code,
      location,
      province,
      country
    } = req.body;

    connection = await getConnection();
    const [
      current
    ] = await connection.query(`SELECT id, nombre FROM sedes WHERE id = ?`, [
      id
    ]);

    if (!current.length) {
      throw generateError(
        'La sede que indica no existe en la base de datos',
        404
      );
    }

    await connection.query(
      `UPDATE sedes SET activo = ?, nombre = ?, direccion = ?, codigo_postal = ?, localidad = ?, provincia = ?, pais = ? WHERE
       id = ?`,
      [active, name, address, postal_code, location, province, country, id]
    );

    res.send({
      status: 'ok',
      message: `Acabas de modificar la Sede ${id} en el Portal del Empleado`,
      data: {
        id: id,
        active: active,
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

module.exports = editHeadquarter;
