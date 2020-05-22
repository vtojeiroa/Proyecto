require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getConnection } = require('../../db');

const {
  userSchema,
  userLoginSchema,
  editUserSchema,
  editPasswordUserSchema
} = require('../validations');

const {
  processAndSavePhoto,
  deletePhoto,
  randomString,
  sendEmail,
  generateError
} = require('../../helpers');

// POST - /USER --- NUEVO USUARIO
async function newUser(req, res, next) {
  let connection;
  try {
    // Validate body payload
    await userSchema.validateAsync(req.body);

    connection = await getConnection();
    const { name, surname, email, password, headquarter } = req.body;

    // Check if user email is already in the db
    const [
      existing
    ] = await connection.query('SELECT id from usuarios where email=?', [
      email
    ]);

    if (existing.length) {
      throw generateError('El email ya existe en la base de datos', 409);
    }

    // Check if sede exists in the db
    const [
      result
    ] = await connection.query(
      `SELECT id, nombre FROM sedes WHERE nombre LIKE ?`,
      [`%${headquarter}%`]
    );

    if (!result.length) {
      throw generateError(
        'La Sede que indica no existe en la base de datos',
        404
      );
    }

    const [sede] = result;

    // hash password
    const dbPassword = await bcrypt.hash(password, 10);
    const registrationCode = randomString(40);

    const validationURL = `${process.env.PUBLIC_HOST}/users/validate?code=${registrationCode}`;

    try {
      await sendEmail({
        email: email,
        title: 'Valida tu cuenta de usuario en la app de Portal del Empleado',
        html: `<div>
      <h1>Validate your email</h1>
      <p>Para validar tu cuenta de usuario pega esta url en tu navegador: ${validationURL}</p>  
    </div>`
      });
    } catch (error) {
      console.error(error.response.body);
      throw new Error(
        'Error enviando mail de validación. Inténtalo de nuevo más tarde.'
      );
    }

    const [data] = await connection.query(
      `
      INSERT INTO usuarios (activo,nombre,apellidos,email,contraseña,fecha_actualizacion_contraseña,codigo_registro,sedes_id)
      VALUES(0 ,?,?, ?, ?,NOW(), ?, ?)
    `,
      [name, surname, email, dbPassword, registrationCode, sede.id]
    );

    res.send({
      staus: 'ok',
      message: `Usuario registrado correctamente.Te hemos enviado un email al correo que nos has facilitado (Revisa la carpeta de SPAM). Sigue las instrucciones para activar tu usuario.`,
      data: {
        id: data.insertID,
        nombre: name,
        apellidos: surname,
        email: email,
        sede: sede.nombre
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// GET /USERS ---- LIST USER (ONLY ADMIN)

async function listUsers(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    let result = await connection.query(`SELECT * FROM usuarios`);
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

// POST - /USERS/LOGIN ----LOGIN USER
async function loginUser(req, res, next) {
  let connection;

  try {
    await userLoginSchema.validateAsync(req.body);

    const { email, password } = req.body;

    connection = await getConnection();

    // Find the user in the db by email
    const [
      dbUser
    ] = await connection.query(
      'SELECT id, email, contraseña, tipo_usuario, sedes_id  from usuarios where email=? AND activo=1',
      [email]
    );

    if (!dbUser.length) {
      throw generateError(
        'No hay ningún usuario activo con ese email en la base de datos. Si te acabas de registrar valida el email',
        404
      );
    }

    const [user] = dbUser;

    const passwordMatch = await bcrypt.compare(password, user.contraseña);

    if (!passwordMatch) {
      throw generateError('Password incorrecta', 401);
    }

    // Build jsonwebtoken
    const tokenPayload = {
      id: user.id,
      role: user.tipo_usuario,
      email: user.email,
      headquarter: user.sedes_id
    };
    const token = jwt.sign(tokenPayload, process.env.SECRET, {
      expiresIn: '30d'
    });

    // Create response
    res.send({
      status: 'ok',
      message: 'Login correcto',
      data: { token }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// POST - USERS/VALIDATE ---- ACTIVATE USER

async function validateUser(req, res, next) {
  let connection;

  try {
    const { code } = req.query;

    connection = await getConnection();

    // Actualizamos el usuario
    const [
      result
    ] = await connection.query(
      'UPDATE usuarios SET activo=1,codigo_registro=NULL WHERE codigo_registro=?',
      [code]
    );

    if (result.affectedRows === 0) {
      throw generateError('Validación incorrecta', 400);
    }

    // // Si queremos dar el token descomentar las siguientes líneas
    // const [user] = await connection.query('SELECT role from users where id=?', [
    //   id
    // ]);

    // // Build jsonwebtoken
    // const tokenPayload = { id: id, role: user[0].role };
    // const token = jwt.sign(tokenPayload, process.env.SECRET, {
    //   expiresIn: '30d'
    // });

    res.send({
      status: 'ok',
      message: 'Usuario validado, ya puedes hacer login.'
      // data: {
      //   token
      // }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// POST - /USERS/:id/PASSWORD  CHANGE PASSWORD
async function updatePasswordUser(req, res, next) {
  let connection;

  try {
    const { id } = req.params;
    // body: oldpassword, newPassword, newPasswordRepeat (opcional)
    connection = await getConnection();

    await editPasswordUserSchema.validateAsync(req.body);

    const { oldPassword, newPassword } = req.body;

    // Comprobar que el usuario del token es el mismo que el que vamos a cambiar la pass

    if (Number(id) !== req.auth.id) {
      throw generateError(
        `No tienes permisos para cambiar la password del usuario con id ${id}`,
        401
      );
    }

    if (oldPassword === newPassword) {
      throw generateError(
        'La nueva password no puede ser la misma que la antigua',
        400
      );
    }

    // Sacar la info del usuario de la base de datos
    const [currentUser] = await connection.query(
      `
      SELECT id, contraseña from usuarios where id=?
      `,
      [id]
    );

    // Código un poco redundante
    if (!currentUser.length) {
      throw generateError(`El usuario con id ${id} no existe`, 404);
    }

    const [dbUser] = currentUser;

    // Comprobar que la vieja password envíada sea la correcta
    // el orden es: password sin encriptar, password encriptada
    const passwordMatch = await bcrypt.compare(oldPassword, dbUser.contraseña);

    if (!passwordMatch) {
      throw generateError('Tu password antigua es incorrecta', 401);
    }

    // generar hash de la password
    const dbNewPassword = await bcrypt.hash(newPassword, 10);

    // actualizar la base de datos
    await connection.query(
      `
      UPDATE usuarios SET contraseña=?, fecha_actualizacion_contraseña=NOW() WHERE id=?
    `,
      [dbNewPassword, id]
    );

    res.send({
      status: 'ok',
      message:
        'Cambio de contraseña realizado correctamente. Todos tus tokens quedan invalidados. Haz login de nuevo para conseguir un token válido.'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// GET - /USERS/:id  --- LISTAR PERFIL USUARIO (ONLY USER OR ADMIN)
async function getUser(req, res, next) {
  let connection;

  try {
    const { id } = req.params;

    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT id, fecha_registro, nombre, apellidos, num_doc_identidad, email,
      foto, direccion, codigo_postal, localidad, provincia, pais,
      telefono, fecha_nacimiento, sedes_id 
      FROM usuarios WHERE id=?  
    `,
      [id]
    );

    // Throw 404 if no results
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
        birthdate: userData.fecha_nacimiento,
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

// PUT - /USERS/:id  --- EDIT USER (ONLY USERS AND ADMIN)
async function editUser(req, res, next) {
  let connection;

  try {
    await editUserSchema.validateAsync(req.body);

    const { id } = req.params;
    const {
      name,
      surname,
      identification_document,
      email,
      address,
      postal_code,
      location,
      province,
      country,
      phone,
      birthdate,
      headquarters
    } = req.body;

    connection = await getConnection();

    //Check if headquarters exists

    const [
      result
    ] = await connection.query(
      `SELECT id, nombre FROM sedes WHERE nombre LIKE ?`,
      [`%${headquarters}%`]
    );

    if (!result.length) {
      throw generateError(
        'La Sede que indica no existe en la base de datos',
        404
      );
    }

    const [sede] = result;

    // Check if user exists

    const [current] = await connection.query(
      `
     SELECT id, fecha_registro, nombre, apellidos, num_doc_identidad, email,
      foto, direccion, codigo_postal, localidad, provincia, pais,
      telefono, fecha_nacimiento, sedes_id
      FROM usuarios WHERE id=?
    `,
      [id]
    );

    if (!current.length) {
      throw generateError(`El usuario con id ${id} no existe`, 404);
    }
    console.log(current[0].id);
    // Check if auth user is the same as :id or is admin
    if (current[0].id !== req.auth.id && req.auth.role !== 'admin') {
      throw generateError('No tienes permisos para editar este usuario', 401);
    }

    // Check if there is a uploaded avatar and process it

    let savedFileName;

    if (req.files && req.files.avatar) {
      try {
        savedFileName = await processAndSavePhoto(req.files.avatar);

        if (current && current.avatar) {
          await deletePhoto(current.avatar);
        }
      } catch (error) {
        throw generateError(
          'No hemos podido procesar la carga de la imagen. Inténtalo de nuevo.',
          400
        );
      }
    } else {
      savedFileName = current.avatar;
    }

    // Update user

    await connection.query(
      `
      UPDATE usuarios SET nombre=?, apellidos=?, num_doc_identidad=?,
      email=?, foto=?, direccion=?, codigo_postal=?, localidad=?, provincia=?, 
      pais=?, telefono=?, fecha_nacimiento=?, sedes_id=? WHERE id=?
    `,
      [
        name,
        surname,
        identification_document,
        email,
        savedFileName,
        address,
        postal_code,
        location,
        province,
        country,
        phone,
        birthdate,
        sede.id,
        id
      ]
    );

    res.send({ status: 'ok', message: 'Usuario actualizado' });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// DELETE - /USERS/:id  ---DESACTIVATE USER
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    const connection = await getConnection();

    await connection.query('UPDATE usuarios SET activo=0 WHERE id=?', [id]);

    connection.release();

    res.send({
      status: 'ok',
      message: `El usuario con la id ${id} ha sido dado de baja`
    });
  } catch (error) {
    next(error);
  }
}
/* 
module.exports = {
  newUser,
  listUsers,
  loginUser,
  getUser,
  editUser,
  updatePasswordUser,
  validateUser,
  deleteUser
}; */
