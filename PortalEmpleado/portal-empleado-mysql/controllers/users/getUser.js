'use strict';

require('dotenv').config();

const { getConnection } = require('../../db');

const { generateError, formatDateToFront } = require('../../helpers');

// GET - /USERS/:id  --- LIST USER PROFILE (ONLY USER OR ADMIN)

async function getUser(req, res, next) {
  let connection;

  try {
    const { id } = req.params;

    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT id, activo, fecha_registro, nombre, apellidos, num_doc_identidad, email,
      foto, direccion, codigo_postal, localidad, provincia, pais,
      telefono, fecha_nacimiento, sedes_id 
      FROM usuarios WHERE id=?  
    `,
      [id]
    );

    if (!result.length) {
      throw generateError(`No hay ningun usuario con el id ${id}`, 404);
    }

    const [userData] = result;

    const sedesId = userData.sedes_id;

    const [
      headquarter
    ] = await connection.query(`SELECT nombre FROM sedes WHERE id=? `, [
      sedesId
    ]);

    const [nombre] = headquarter;

    let payload;
    if (userData.id === req.auth.id || req.auth.role === 'admin') {
      payload = {
        id: id,
        active: userData.activo,
        registrationDate: userData.fecha_registro,
        name: userData.nombre,
        surname: userData.apellidos,
        identification_document: userData.num_doc_identidad,
        email: userData.email,
        avatar: userData.foto,
        address: userData.direccion,
        postal_code: userData.codigo_postal,
        location: userData.localidad,
        province: userData.provincia,
        country: userData.pais,
        phone: userData.telefono,
        birthdate: formatDateToFront(new Date(userData.fecha_nacimiento)),
        headquarters: nombre.nombre
      };
    } else {
      throw generateError(
        `No tienes permiso para visualizar el perfil del id ${id}`,
        401
      );
    }

    res.send({
      status: 'ok',
      data: payload
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getUser;
