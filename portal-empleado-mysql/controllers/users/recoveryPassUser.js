'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');
const { getConnection } = require('../../db');

const {
  formatDateToDB,
  sendEmail,
  randomString,
  generateError
} = require('../../helpers');

const { recoveryPasswordSchema } = require('../validations');

//POST-- /USERS/PASSWORD/RECOVERY

async function recoveryPassUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    await recoveryPasswordSchema.validateAsync(req.body);

    const { email, postal_code, birthdate } = req.body;

    const [current] = await connection.query(
      `
     SELECT id, nombre, apellidos, email,
       codigo_postal,  fecha_nacimiento
      FROM usuarios WHERE email=?
    `,
      [email]
    );

    if (!current.length) {
      throw generateError(
        `Lo sentimos,no figura ningún usuario registrado con el email ${email} `,
        404
      );
    }

    const [dataUser] = current;

    if (
      dataUser.codigo_postal === postal_code &&
      birthdate ===
        formatDateToDB(new Date(dataUser.fecha_nacimiento)).substring(0, 10)
    ) {
      const randomPassword = randomString(20);

      const date = formatDateToDB(new Date());
      //hash password
      const oneUsePassword = await bcrypt.hash(randomPassword, 10);

      try {
        await sendEmail({
          email: email,
          title:
            'Recuperacion de contraseña para la app de Portal del Empleado',
          html: `<div>
      <h1>Cambia tu contraseña</h1>
      <p>Para modificar tu contraseña, haz login en el Portal del Empleado con
      la siguiente contraseña: ${randomPassword}. Una vez accedas, utiliza la 
      opcion modificar contraseña para personalizarla</p>  
      </div>`
        });
      } catch (error) {
        console.error(error.response.body);
        throw new Error(
          'Error enviando mail de recuperacion de Contraseña. Inténtalo de nuevo más tarde.'
        );
      }

      await connection.query(
        `UPDATE usuarios SET contraseña = ?, fecha_actualizacion_contraseña =?
       WHERE email = ? `,
        [oneUsePassword, date, dataUser.email]
      );
    } else {
      throw generateError(
        `Lo sentimos, no hemos podido verificar tu identidad con los datos que nos has facilitado, contacta con el administrador `,
        404
      );
    }
    res.send({
      status: 'ok',
      message: `Te hemos enviado un email al correo que nos has facilitado (Revisa la carpeta de SPAM). Sigue las instrucciones para modificar tu contraseña.`
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = recoveryPassUser;
