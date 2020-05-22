'use strict';
/* 
const { getConnection } = require('../db');
const {
  formatDateToDB,
  sendEmail,
  randomString,
  generateError
} = require('../helpers');

const {
  incidenceSchema,
  voteSchema,
  searchSchema,
  editIncidenceSchema
} = require('../controllers/validations');

// GET - /INCIDENCES
async function listIncidences(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { search } = req.query;

    let result;

    if (search) {
      await searchSchema.validateAsync(search);

      result = await connection.query(
        `SELECT i.id,i.servicios_id,i.usuarios_id, i.descripcion,
        i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro,
        v.valoracion, v.comentario_valoracion  FROM incidencias i, valoraciones v
        WHERE v.incidencias_id = i.id  AND i.usuarios_id IN 
        (SELECT id FROM usuarios WHERE sedes_id IN
        (SELECT id FROM sedes WHERE nombre LIKE ?)) 
        ORDER BY fecha_registro;`,
        [`%${search}%`, `%${search}%`]
      );
    } else {
      result = await connection.query(
        `SELECT i.id,i.servicios_id,i.usuarios_id, i.descripcion,
        i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro,
        v.valoracion, v.comentario_valoracion FROM incidencias i 
        INNER JOIN valoraciones v WHERE v.incidencias_id = i.id 
        ORDER BY fecha_registro DESC`
      );
    }

    const [entries] = result;

    res.send({
      status: 'ok',
      data: entries
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// POST - /incidences
async function newIncidence(req, res, next) {
  let connection;
  //Meterlos en la base de datos
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
      result.insertId + '-' + dataIncType.tipo + '-' + randomString(20);

    const incidenceNumberURL = `${process.env.PUBLIC_HOST}/incidences/${result.insertId}?number=${incidenceNumber}`;

    try {
      await sendEmail({
        email: req.auth.email,
        title: 'Registro de incidencia en el Portal del Empleado',
        html: `<div>
      <h1>Hemos registrado su incidencia al departamento  de ${dataIncType.tipo} en el Portal del Empleado</h1>
      <p>Para revisar tu Incidencia haz click o pega esta url en el navegador: ${incidenceNumberURL}</p>  
      <p>Si deseas modificarla, haz Login en la aplicación, ve al apartado de incidencias, e
      introduce en el buscador el siguiente código de incidencia: ${incidenceNumber}.</p>
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

// GET - /incidences/:id
async function getIncidence(req, res, next) {
  let connection;
  try {
    const { id } = req.params;
    const { number } = req.query;

    connection = await getConnection();
    let result;
    if (number) {
      result = await connection.query(
        `select i.id,i.servicios_id, i.usuarios_id, i.fecha_registro, i.descripcion,i.fecha_resolucion, i.comentario_resolucion ,avg(v.valoracion) as vote
          from incidencias i
          left join valoraciones v
          on i.id = v.servicios_id
          WHERE i.codigo_incidencia = ? GROUP BY i.id`,
        [number]
      );
    } else {
      result = await connection.query(
        `select i.id,i.servicios_id, i.usuarios_id, i.fecha_registro, i.descripcion,i.fecha_resolucion, i.comentario_resolucion ,avg(v.valoracion) as vote
          from incidencias i
          left join valoraciones v
          on i.id = v.servicios_id
          WHERE i.id = ? GROUP BY i.id`,
        [id]
      );
    }
    const [data] = result;

    if (!data[0].id) {
      throw generateError(`La incidencia número ${id} no existe`, 404);
    }

    res.send({
      status: 'ok',
      data: data[0]
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// DELETE - /INCIDENCES/:id
async function deleteIncidence(req, res, next) {
  let connection;
  try {
    const { id } = req.params;

    connection = await getConnection();

    // Delete incidence and vote if exists!
    const [
      current
    ] = await connection.query('SELECT * FROM incidencias WHERE id=?', [id]);

    if (!current.length) {
      throw generateError(`No hay ninguna incidencia con el número ${id}`, 400);
    }

    await connection.query('DELETE FROM valoraciones WHERE incidencias_id=?', [
      id
    ]);
    await connection.query('DELETE FROM incidencias WHERE id=?', [id]);

    res.send({
      status: 'ok',
      message: `La incidencia con el número ${id} ha sido borrada`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

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

// GET - /incidences/:id/vote
async function permisionToVote(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { code } = req.query;
    const [
      current
    ] = await connection.query(
      'SELECT * FROM incidencias WHERE codigo_incidencia=?',
      [code]
    );

    const [data] = current;

    res.send({
      status: 'ok',
      message: 'Ya puedes valorar la resolución de la incidencia.',
      data: {
        description: data.descripcion,
        date: data.fecha_resolucion,
        response: data.comentario_resolucion,
        vote_code: code
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}
// POST - /incidences/:id/vote
async function voteIncidence(req, res, next) {
  let connection;
  try {
    const { id } = req.params;
     const { code } = req.query; 
    const userId = req.auth.id;

    // Validate payload
    await voteSchema.validateAsync(req.body);

    const { vote, description } = req.body;

    connection = await getConnection();

    // Check if the incidence actually exists
    const [
      entry
    ] = await connection.query(
      'SELECT id, servicios_id, usuarios_id, activo,codigo_incidencia FROM incidencias WHERE id=?',
      [id]
    );
    const [dataEntry] = entry;
    if (!entry.length) {
      throw generateError(`La incidencia con el número ${id} no existe`, 404);
    }
    // Check if the incidence userid === token id actually exists
    if (dataEntry.usuarios_id !== userId) {
      throw generateError(
        `No tienes permisos para votar la incidencia ${id}`,
        403
      );
    }
    // Check if the incidence is active
    if (dataEntry.activo !== 0) {
      throw generateError(
        `La incidencia con el número ${id} no está cerrada`,
        403
      );
    }

    // Check if the user with the current ID already voted for this entry

    if (!dataEntry.codigo_incidencia) {
      throw generateError(`Ya has valorado esta incidencia`, 403);
    }

    //Vote
    await connection.query(
      `
      INSERT INTO valoraciones(incidencias_id,usuarios_id ,servicios_id, valoracion, comentario_valoracion) 
      VALUES(?, ?, ?, ?, ?)`,
      [id, dataEntry.usuarios_id, dataEntry.servicios_id, vote, description]
    );

    // Delete voteCode from table usuarios

    await connection.query(
      'UPDATE incidencias SET codigo_incidencia=NULL WHERE id=?',
      [id]
    );

    res.send({
      status: 'ok',
      message: `El voto de ${vote} puntos para la incidencia con id ${id} se ha realizado con éxito`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

async function getEntryVotes(req, res, next) {
  let connection;
  try {
    const { incidence } = req.body;
    connection = await getConnection();

    const [
      dataIncidence
    ] = await connection.query(
      `SELECT id,tipo FROM servicios WHERE tipo LIKE ?`,
      [`%${incidence}%`]
    );

    if (!dataIncidence.length) {
      throw generateError(
        'El tipo de incedencia que indica no existe en la base de datos',
        404
      );
    }
    let [incidenceId] = dataIncidence;

    const [
      votes
    ] = await connection.query(
      'SELECT i.descripcion, v.servicios_id,  v.valoracion,  v.comentario_valoracion, v.valoracion, v.valoracion FROM valoraciones v  INNER JOIN incidencias i ON  i.id = v.incidencias_id  WHERE v.servicios_id=? ',
      [incidenceId.id]
    );
    const [
      avgVotes
    ] = await connection.query(
      'SELECT AVG(valoracion) AS avgvotes FROM valoraciones WHERE servicios_id=? ',
      [incidenceId.id]
    );
    const [average] = avgVotes;
    console.log(average);
    res.send({
      status: 'ok',
      incidence_type: incidenceId.tipo,
      average_votes: average.avgvotes,
      data: votes
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  listIncidences,
  newIncidence,
  getIncidence,
  deleteIncidence,
  editIncidence,
  permisionToVote,
  voteIncidence,
  getEntryVotes
}; */
