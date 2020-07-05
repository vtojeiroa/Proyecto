'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB, sendEmail, randomString } = require('../../helpers');

const { editServiceSchema } = require('../validations');

// PUT - /incidencies/:id
async function adminEditIncidence(req, res, next) {
  let connection;
  try {
    const { description } = req.body;
    const { id } = req.params;

    await editServiceSchema.validateAsync(req.body);

    connection = await getConnection();

    const [current] = await connection.query(
      'SELECT * FROM incidencias WHERE activo=1'
    );

    const [data] = current;

    if (req.auth.role === 'admin') {
      await connection.query(
        'UPDATE incidencias SET activo=0, fecha_resolucion=?, comentario_resolucion=? WHERE id=?',
        [formatDateToDB(new Date()), description, id]
      );

      const { email } = req.auth;

      const voteCode = randomString(20);

      const voteURL = `${process.env.PUBLIC_HOST}/incidences/${id}/vote?code=${voteCode}`;
      try {
        await sendEmail({
          email: email,
          title:
            'Hemos solucionado la incidencia registrada en el Portal del Empleado',
          html: `<div>
            <h1>La incidencia ha sido solucionada</h1>
            <p>Para revisar la solución de la Incidencias, haz click o pega esta url en tu navegador: ${voteURL}</p>  
            <p> Recuerda que puedes valorar el proceso de gestión de la incidencia. Para ello debes acceder al Portal e ir al apartado de incidencias y allí podrás realizar la valoración.</p>
            </div>`
        });
        await connection.query(
          `
                UPDATE incidencias SET codigo_incidencia =? WHERE id=?
              `,
          [voteCode, id]
        );
      } catch (error) {
        console.error(error.response.body);
        throw new Error(
          'Error enviando mail de cierre de la incidencia. Inténtalo de nuevo más tarde.'
        );
      }
    } else if (
      req.auth.id === data.usuarios_id &&
      req.auth.role !== 'maintenance'
    ) {
      await connection.query(
        'UPDATE incidencias SET descripcion=? WHERE id=?',
        [description, id]
      );
    } else {
      throw new Error('No tienes permisos para modificar esta incidencia.');
    }

    res.send({
      status: 'ok',
      message: `Se ha actualizado la información de la incidencia ${id}`,
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

module.exports = adminEditIncidence;
