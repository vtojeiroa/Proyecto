'use strict';

require('dotenv').config();

const { getConnection } = require('../../db');

// GET /ADMIN/USERS ---- LISTS USER (ONLY ADMIN)

async function listUsers(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    /*  const { active } = req.query; */

    let result;

    /* if (active) {
      result = await connection.query(
        `SELECT * FROM usuarios WHERE activo = ?`,
        [active]
      );
    } else {
      result = await connection.query(`SELECT * FROM usuarios`);
    } */

    result = await connection.query(`SELECT id, tipo_usuario,activo,nombre,apellidos,num_doc_identidad,foto,email,fecha_actualizacion_contraseña, direccion, codigo_postal, localidad, provincia,pais,
    telefono,fecha_nacimiento,fecha_registro,ultima_actualizacion, (SELECT nombre FROM sedes WHERE id = sedes_id) AS sedes_id FROM usuarios`);

    let [users] = result;

    res.send({
      status: 'ok',
      data: users
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listUsers;
