'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB, generateError } = require('../../helpers');

// GET - /INCIDENCES
async function searchIncidences(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { headquarter, type, date_init, date_end } = req.query;

    let result;

    if (headquarter && type && date_init && date_end) {
      result = await connection.query(
        /*        `SELECT i.id,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo,  i.servicios_id, i.usuarios_id, i.descripcion,
                i.activo, i.fecha_resolucion, i.comentario_resolucion,  i.fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion 
               FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion  
               FROM incidencias i WHERE usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN (SELECT id FROM sedes WHERE nombre LIKE ?))  AND (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?))
               AND (fecha_registro >=  ? AND  fecha_registro <  ?) 
               ORDER BY fecha_registro DESC;` */

        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id WHERE i.usuarios_id IN (SELECT u.id FROM usuarios u WHERE u.sedes_id IN 
          (SELECT d.id FROM sedes d WHERE d.nombre LIKE ?))  AND (i.servicios_id = (SELECT s.id FROM servicios s WHERE s.tipo LIKE ?))  AND (i.fecha_registro >=  ? AND  i.fecha_registro <  ?) ORDER BY i.fecha_registro DESC;`,

        [
          `%${headquarter}%`,
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter && type) {
      result = await connection.query(
        /*    `SELECT id ,(select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id,usuarios_id,descripcion,
                i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion
                     FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion
              FROM incidencias i WHERE usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN (SELECT id FROM sedes WHERE nombre LIKE ?)) AND (servicios_id = (SELECT id FROM servicios
                 WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;` */

        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id  WHERE i.usuarios_id IN (SELECT u.id FROM usuarios u WHERE u.sedes_id IN
           (SELECT d.id FROM sedes d WHERE d.nombre LIKE ?)) AND (i.servicios_id = (SELECT s.id FROM servicios s WHERE s.tipo LIKE ?)) ORDER BY i.fecha_registro DESC;`,

        [`%${headquarter}%`, `%${type}%`]
      );
    } else if (type && date_init && date_end) {
      result = await connection.query(
        /* `SELECT id ,(select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id,usuarios_id,descripcion,
                i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion 
                    FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion 
                     FROM incidencias i WHERE (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) AND (fecha_registro >=  ? AND  fecha_registro <  ?) ORDER BY fecha_registro DESC;` */
        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id   WHERE (i.servicios_id = (SELECT d.id FROM servicios d WHERE d.tipo LIKE ?))
          AND (i.fecha_registro >=  ? AND  i.fecha_registro <  ?) ORDER BY i.fecha_registro DESC;`,

        [
          `%${type}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter && date_init && date_end) {
      result = await connection.query(
        /* `SELECT id ,(select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id,usuarios_id,descripcion,
                i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion 
                    FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion 
                     FROM incidencias i WHERE usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN (SELECT id FROM sedes WHERE nombre LIKE ?))  AND (fecha_registro >=  ? AND  fecha_registro <  ?)
                      ORDER BY fecha_registro DESC
        ; `*/

        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id  WHERE i.usuarios_id IN (SELECT u.id FROM usuarios u WHERE u.sedes_id IN 
          (SELECT d.id FROM sedes d WHERE d.nombre LIKE ?)) AND (i.fecha_registro >=  ? AND  i.fecha_registro <  ?) ORDER BY i.fecha_registro DESC;`,

        [
          `%${headquarter}%`,
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else if (headquarter) {
      result = await connection.query(
        /* `SELECT id ,(select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id,usuarios_id,descripcion,
                i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion 
                    FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion 
                     FROM incidencias i WHERE usuarios_id IN (SELECT id FROM usuarios WHERE sedes_id IN (SELECT id FROM sedes WHERE nombre LIKE ?)) ORDER BY fecha_registro DESC;` */

        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id   WHERE i.usuarios_id IN (SELECT u.id FROM usuarios u WHERE u.sedes_id IN
           (SELECT d.id FROM sedes d WHERE d.nombre LIKE ?))  ORDER BY i.fecha_registro DESC;`,

        [`%${headquarter}%`]
      );
    } else if (type) {
      result = await connection.query(
        /* `SELECT id, (select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id,usuarios_id,descripcion,i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion 
                    FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion 
                     FROM incidencias i WHERE (servicios_id = (SELECT id FROM servicios WHERE tipo LIKE ?)) ORDER BY fecha_registro DESC;` */
        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id WHERE (i.servicios_id = (SELECT s.id FROM servicios s WHERE s.tipo LIKE ?)) ORDER BY i.fecha_registro DESC;`,

        [`%${type}%`]
      );
    } else if (date_init && date_end) {
      result = await connection.query(
        /*  `SELECT id,(select s.tipo from servicios s where id =servicios_id) as tipo,servicios_id,usuarios_id,descripcion,
                i.activo,fecha_resolucion, comentario_resolucion, fecha_registro, (SELECT v.valoracion FROM valoraciones v WHERE v.incidencias_id = i.id) AS valoracion , (SELECT v.comentario_valoracion 
                    FROM valoraciones v WHERE v.incidencias_id = i.id) AS comentario_valoracion, (SELECT v.fecha_registro FROM valoraciones v WHERE v.incidencias_id = i.id) AS fecha_registro_valoracion
                      FROM incidencias i WHERE (fecha_registro >=  ? AND  fecha_registro <  ?) ORDER BY fecha_registro DESC
        ;` */
        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id WHERE (i.fecha_registro >=  ? AND  i.fecha_registro <  ?) ORDER BY i.fecha_registro DESC;`,

        [
          formatDateToDB(new Date(date_init)),
          formatDateToDB(new Date(date_end))
        ]
      );
    } else {
      result = await connection.query(
        `SELECT i.id ,(select s.tipo from servicios s where s.id = i.servicios_id) as tipo, i.usuarios_id, i.descripcion, i.activo, i.fecha_resolucion, i.comentario_resolucion, i.fecha_registro ,
         v.valoracion, v.comentario_valoracion,v.fecha_registro FROM incidencias i LEFT JOIN valoraciones v ON v.incidencias_id=i.id  ORDER BY i.fecha_registro DESC;`
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

module.exports = searchIncidences;
