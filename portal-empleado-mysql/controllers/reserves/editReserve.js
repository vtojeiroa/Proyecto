'use strict';

const { getConnection } = require('../../db');
const {
  formatDateToDB,
  sendEmail,
  randomString,
  generateError
} = require('../../helpers');

const {
  /*   reserveSchema,
  voteSchema,
  searchSchema, */
  editReserveSchema
} = require('../validations');

// PUT - /RESERVES/:id
async function editReserve(req, res, next) {
  let connection;
  try {
    const { description } = req.body;
    const { id } = req.params;

    await editReserveSchema.validateAsync(req.body);

    connection = await getConnection();

    const [
      current
    ] = await connection.query('SELECT * FROM incidencias WHERE id=?', [id]);
    if (!current.length) {
      throw generateError(`la incidencia número ${id} no existe`, 404);
    }

    const [data] = current;
    const date = formatDateToDB(new Date());

    if (
      data.usuarios_id === req.auth.id &&
      date >= formatDateToDB(new Date(data.fecha_hora_inicio_reserva))
    ) {
      throw generateError(
        `No tienes permiso para modificar la reserva ${id},la hora de inicio de la reserva ya ha pasado `,
        403
      );
    } else if (
      (data.usuarios_id === req.auth.id &&
        date < formatDateToDB(new Date(data.fecha_hora_inicio_reserva))) ||
      req.auth.role === 'admin'
    ) {
      await connection.query('UPDATE reservas SET  WHERE id=?', [id]);
    } else {
      throw generateError(
        `No tienes permiso para modificar la reserva ${id}`,
        403
      );
    }

    // send email with information of modification reserve.
    const [
      dataTypeReserve
    ] = await connection.query(
      `SELECT id, tipo FROM servicios WHERE tipo = ?`,
      [data.incidencia_id]
    );

    if (!dataTypeReserve.length) {
      throw generateError(
        'El tipo de reserva que indica no existe en la base de datos'
      );
    }
    const [dataReserve] = dataTypeReserve;
    try {
      await sendEmail({
        email: req.auth.email,
        title: 'Registro de modificación de reserva en el Portal del Empleado',
        html: `<div>
            <h1>Hemos modificado tu reserva de ${dataReserve.tipo} en el Portal del Empleado</h1>
      <p>Para revisar tu reserva haz Login en la aplicación, ve al apartado de reservas, e
     introduce en el buscador el siguiente código de reserva ${data.codigo_reserva}.</p>
    </div>`
      });
    } catch (error) {
      console.error(error.response.body);
      throw new Error(
        'Error enviando mail de cierre de la incidencia. Inténtalo de nuevo más tarde.'
      );
    }

    res.send({
      status: 'ok',
      message: `Se ha actualizado la información de la reservaa ${id}`,
      data: {
        id,
        description
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editReserve;
