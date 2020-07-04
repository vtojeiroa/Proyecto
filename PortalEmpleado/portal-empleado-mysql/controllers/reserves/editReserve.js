'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB, sendEmail, generateError } = require('../../helpers');

const { editServiceSchema } = require('../validations');

// PUT - /RESERVES/:id
async function editReserve(req, res, next) {
  let connection;
  try {
    const { description } = req.body;
    const { id } = req.params;

    await editServiceSchema.validateAsync(req.body);

    connection = await getConnection();

    const [
      current
    ] = await connection.query('SELECT * FROM reservas WHERE id=?', [id]);
    if (!current.length) {
      throw generateError(`la reserva número ${id} no existe`, 404);
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
      // send email with information of modification reserve.
      const [
        dataTypeReserve
      ] = await connection.query(
        `SELECT id, tipo FROM servicios WHERE id = ?`,
        [data.servicios_id]
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
          title:
            'Registro de modificación de reserva en el Portal del Empleado',
          html: `<div>
              <h1>Hemos modificado tu reserva de ${dataReserve.tipo}</h1>
        <p>Para revisarla puedes acceder al Portal, ir al apartado de reservas, e
       introducir en el buscador el siguiente código de reserva <strong>${data.codigo_reserva}</strong>.</p>
      </div>`
        });
      } catch (error) {
        console.error(error.response.body);
        throw new Error(
          'Error enviando mail de cierre de la incidencia. Inténtalo de nuevo más tarde.'
        );
      }

      await connection.query(
        'UPDATE reservas SET motivo_reserva = ? WHERE id=?',
        [description, id]
      );
    } else {
      throw generateError(
        `No tienes permiso para modificar la reserva ${id}`,
        403
      );
    }

    res.send({
      status: 'ok',
      message: `Se ha actualizado la información de la reserva ${id}`,
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
