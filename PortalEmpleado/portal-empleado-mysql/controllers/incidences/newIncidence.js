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

    const incidenceCode =
      result.insertId +
      '-' +
      dataIncType.tipo.slice(0, 4) +
      '-' +
      randomString(10);

    const incidenceCodeURL = `${process.env.PUBLIC_HOST}/incidences/code/${incidenceCode}`;

    try {
      await sendEmail({
        email: req.auth.email,
        title: 'Registro de incidencia en el Portal del Empleado',
        html: `<div>
         <h1>Incidencia registrada</h1>
     <p>Hemos registrado tu incidencia al departamento  de ${
       dataIncType.tipo
     } el día ${new Date(date).toLocaleString(
          'es-ES'
        )}. Le hemos asignado el código: <strong>${incidenceCode}</strong> </p>  
      <p>Si deseas revisarla, haz click en el enlace: ${incidenceCodeURL}, o copialo en tu navegador. También puedes revisarla en el apartado de incidencias de tu Portal.</p>
       <br>
        <p>Los datos de tu incidencia son:</p>     
       <p>Número de Incidencia: ${incidenceCode}</p>
       <p>Tipo de Incidencia: ${dataIncType.tipo}</p>
       <p>Fecha de Registro: ${new Date(date).toLocaleString('es-ES')}</p>
       <p>Descripición: ${description}</p>
       <p>Esperamos solucionarla a la mayor brevedad posible.</p>
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
      [incidenceCode, result.insertId]
    );

    res.send({
      status: 'ok',
      message: `Hemos registrado su incidencia en el Portal del Empleado. Los datos de tu incidencia son:`,
      data: {
        id: result.insertId,
        user: req.auth.id,
        Fecha: date,
        Tipo_de_incidencia: dataIncType.tipo,
        Número_de_incidencia: incidenceCode,
        Descripcion: description
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newIncidence;
