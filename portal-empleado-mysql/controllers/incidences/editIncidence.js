'use strict';

const { getConnection } = require('../../db');
const {
  formatDateToDB,
  sendEmail,
  randomString,
  generateError
} = require('../../helpers');

const { editIncidenceSchema } = require('../validations');

// PUT - /incidencies/:id
async function editIncidence(req, res, next) {
  let connection;
  try {
    const { description } = req.body;
    const { id } = req.params;

    await editIncidenceSchema.validateAsync(req.body);

    connection = await getConnection();

    const [
      current
    ] = await connection.query('SELECT * FROM incidencias WHERE id=?', [id]);

    const [data] = current;

    if (!current.length) {
      throw generateError(`la incidencia número ${id} no existe`, 404);
    }

    if (data.activo === 0) {
      throw generateError(
        `la incidencia número ${id} no se puede editar, ya ha sido cerrada`,
        409
      );
    }

    if (req.auth.id !== data.usuarios_id && req.auth.role === 'maintenance') {
      await connection.query(
        'UPDATE incidencias SET activo=0, fecha_resolucion=?, comentario_resolucion=? WHERE id=?',
        [formatDateToDB(new Date()), description, id]
      );

      const [
        dataUser
      ] = await connection.query('SELECT email FROM usuarios WHERE id=?', [
        data.usuarios_id
      ]);
      // send email with information of close incidence.
      const [email] = dataUser;

      const voteCode = randomString(40);

      const voteURL = `${process.env.PUBLIC_HOST}/incidences/${id}/vote?code=${voteCode}`;
      try {
        await sendEmail({
          email: email,
          title:
            'Hemos solucionado la incidencia registrada en el Portal del Empleado',
          html: `<div>
            <h1>Valora el proceso de resolucion de la incidencia</h1>
            <p>Para revisar la solución y valorar el proceso de resolución de Incidencias pega esta url en tu navegador: ${voteURL}</p>  
            <p> o haga Login en la aplicación, vaya apartado de incidencias, y en el buscador introduzca el codigo de votacion que le adjuntamos.</p>
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

module.exports = editIncidence;
