'use strict';

const { getConnection } = require('../../db');

// GET - /INCIDENCES
async function listTypeReserves(req, res, next) {
  let connection;
  try {
    const { headquarter } = req.query;
    connection = await getConnection();

    let result;

    if (headquarter) {
      result = await connection.query(
        `SELECT s.seccion, s.tipo, s.descripcion,(SELECT nombre FROM sedes WHERE id = ss.sedes_id) AS sede, ss.disponibilidad_servicios
      FROM servicios s INNER JOIN sedes_servicios ss ON s.id = ss.servicios_id
       WHERE activo =1 AND seccion ='reserva' AND ss.sedes_id IN (SELECT id FROM sedes WHERE nombre LIKE ? );`,
        [`%${headquarter}%`]
      );
    } else {
      result = await connection.query(
        `SELECT seccion, tipo,descripcion FROM servicios  WHERE activo =1 AND seccion = 'reserva' ;`
      );
    }
    const [data] = result;

    res.send({
      status: 'ok',
      name: `${data[0].seccion}`,
      data: {
        data
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listTypeReserves;
