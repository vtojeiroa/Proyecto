'use strict';

const { getConnection } = require('../../db');

const { createAssignmentSchema } = require('../validations');

// POST - /services
async function createAssignment(req, res, next) {
  let connection;

  try {
    await createAssignmentSchema.validateAsync(req.body);

    const { headquarter, service_type, disponibility } = req.body;
    connection = await getConnection();

    const [headquarterData] = await connection.query(
      `SELECT id, nombre FROM sedes  WHERE nombre LIKE '%${headquarter}%'`
    );
    const [service_typeData] = await connection.query(
      `SELECT id, seccion, tipo FROM servicios WHERE tipo LIKE '%${service_type}%'`
    );
    const [headquarterDataId] = headquarterData;
    const [service_typeDataId] = service_typeData;

    await connection.query(
      `INSERT INTO sedes_servicios(sedes_id, servicios_id, disponibilidad_servicios)
        VALUES(?,?,?)`,
      [headquarterDataId.id, service_typeDataId.id, disponibility]
    );

    res.send({
      status: 'ok',
      message: `La asignacion del servicio ${service_typeDataId.seccion} de ${service_typeDataId.tipo} a la ${headquarterDataId.nombre} ha sido realizada con exito`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = createAssignment;
