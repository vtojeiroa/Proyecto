'use strict';

const { getConnection } = require('../../db');
const { generateError } = require('../../helpers');

// GET - /incidences/:code
async function VoteWithCode(req, res, next) {
  let connection;
  try {
    const { code } = req.query;

    connection = await getConnection();

    if (!code) {
      throw generateError(`No ha indicado ningún código de incidencia`, 404);
    }

    const existData = await connection.query(
      `SELECT id,usuarios_id, codigo_incidencia FROM incidencias WHERE codigo_incidencia = ?`,
      [code]
    );
    const [dataId] = existData;

    if (!dataId.length) {
      throw generateError(`La incidencia con el código ${code} no existe`, 404);
    }

    let result = await connection.query(
      `select id,servicios_id, usuarios_id, fecha_registro, descripcion,fecha_resolucion, comentario_resolucion,(SELECT v.valoracion FROM valoraciones v WHERE v.id = i.id) AS valoracion, (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.id = i.id) AS fecha_registro_valoracion FROM incidencias i WHERE codigo_incidencia = ?`,
      [code]
    );

    const [data] = result;

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

module.exports = VoteWithCode;
