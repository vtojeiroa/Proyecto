'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB, generateError } = require('../../helpers');

// GET - /INCIDENCES
async function ListIncidences(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const userId = req.auth.id;

    const { active, type, date_init, date_end } = req.query;

    let result;

    if (active && type && date_init && date_end) {
      result = await connection.query(
        `SELECT id,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo, servicios_id,usuarios_id,descripcion,i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE usuarios_id = ? AND activo = ? AND (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) AND (fecha_registro >=  ? AND  fecha_registro <  ?)  ORDER BY fecha_registro DESC;`,
        [
          userId,
          active,
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (active && type) {
      result = await connection.query(
        `SELECT id ,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id,usuarios_id,descripcion,i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE usuarios_id = ? AND activo = ? AND (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;`,
        [userId, active, `%${type}%`]
      );
    } else if (type && date_init && date_end) {
      result = await connection.query(
        `SELECT id ,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id,usuarios_id,descripcion,i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE usuarios_id = ?  AND (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) AND (fecha_registro >=  ? AND  fecha_registro <  ?) ORDER BY fecha_registro DESC;`,
        [
          userId,
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (active && date_init && date_end) {
      result = await connection.query(
        `SELECT id ,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id,usuarios_id,descripcion,i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE usuarios_id = ? AND activo = ? AND (fecha_registro >=  ? AND  fecha_registro <  ?) ORDER BY fecha_registro DESC
        ;`,
        [
          userId,
          active,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (active) {
      result = await connection.query(
        `SELECT id ,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id,usuarios_id,descripcion,i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE usuarios_id = ? AND  activo = ? ORDER BY fecha_registro DESC;`,
        [userId, active]
      );
    } else if (type) {
      result = await connection.query(
        `SELECT id, (select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id,usuarios_id,descripcion,i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE usuarios_id = ? AND (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;`,
        [userId, `%${type}%`]
      );
    } else if (date_init && date_end) {
      result = await connection.query(
        `SELECT id,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id,usuarios_id,descripcion,i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion  FROM incidencias i WHERE usuarios_id = ? AND (fecha_registro >=  ? AND  fecha_registro <  ?) ORDER BY fecha_registro DESC
        ;`,
        [
          userId,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else {
      result = await connection.query(
        `SELECT i.id ,(select s.seccion from servicios s where id =servicios_id) as servicio ,(select s.tipo from servicios s where id =servicios_id) as tipo,i.servicios_id,i.usuarios_id,i.descripcion,i.activo,i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion, (SELECT v.comentario_valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion FROM incidencias i WHERE usuarios_id = ? ORDER BY fecha_registro DESC`,
        [userId]
      );
    }

    const [entries] = result;

    if (!entries.length) {
      throw generateError(
        'No hemos encontrado ninguna incidencia que se ajuste a los parámetros indicados',
        400
      );
    }

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

module.exports = ListIncidences;
