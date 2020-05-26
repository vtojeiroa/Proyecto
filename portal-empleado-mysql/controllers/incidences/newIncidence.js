'use strict';

const { getConnection } = require('../../db');
const {
  formatDateToDB,
  sendEmail,
  randomString,
  generateError
} = require('../../helpers');

const { incidenceSchema } = require('../validations');

// POST - /incidences
async function newIncidence(req, res, next) {
  let connection;

  try {
    await incidenceSchema.validateAsync(req.body);

    const { incidenceType, description } = req.body;

    connection = await getConnection();

    const date = formatDateToDB(new Date());

    // Check tipe of incidence exists in the db
    const [
      dataIncidence
    ] = await connection.query(
      `SELECT id, tipo FROM servicios WHERE tipo LIKE ?`,
      [`%${incidenceType}%`]
    );

    if (!dataIncidence.length) {
      throw generateError(
        'El tipo de incidencia que indica no existe en la base de datos',
        404
      );
    }
    const [dataIncType] = dataIncidence;

    const [result] = await connection.query(
      `INSERT INTO incidencias(servicios_id, usuarios_id, descripcion,activo)
        VALUES(?, ?, ?, ?)`,
      [dataIncType.id, req.auth.id, description, 1]
    );
    // Send email with number of incidence

    const incidenceNumber =
      result.insertId + '-' + dataIncType.tipo + '-' + randomString(10);

    try {
      await sendEmail({
        email: req.auth.email,
        title: 'Registro de incidencia en el Portal del Empleado',
        html: `<div>
         <h1>Incidencia registrada</h1>
     <p>Hemos registrado tu incidencia al departamento  de ${dataIncType.tipo} con el código: <strong>${incidenceNumber}</strong> el día ${date}</p>  
      <p>Si deseas modificarla, haz Login en el Portal, ve al apartado de incidencias, e introduce en el buscador el código que te hemos facilitado.</p>
    </div>`
      });
    } catch (error) {
      console.error(error.response.body);
      throw new Error(
        'Error enviando mail de la incidencia. Inténtalo de nuevo más tarde.'
      );
    }
    await connection.query(
      `
      UPDATE incidencias SET codigo_incidencia =? WHERE id=?
    `,
      [incidenceNumber, result.insertId]
    );

    res.send({
      status: 'ok',
      message: `Hemos registrado su incidencia en el Portal del Empleado`,
      data: {
        id: result.insertId,
        user: req.auth.id,
        date: date,
        incidence: dataIncType.tipo,
        incidence_Number: incidenceNumber,
        description: description
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newIncidence;
