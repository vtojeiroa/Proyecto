'use strict';

const { getConnection } = require('../../db');
const { formatDateToDB, sendEmail } = require('../../helpers');

const { attentionSchema } = require('../validations');

// POST - /attention
async function makeQuestion(req, res, next) {
  let connection;

  try {
    await attentionSchema.validateAsync(req.body);

    const { email, name, phone, service, message } = req.body;

    connection = await getConnection();

    const date = formatDateToDB(new Date());

    // Send email with question

    try {
      await sendEmail({
        email: 'vtojeiroa+1@gmail.com',
        title:
          'Nueva consulta para Atención al cliente en el Portal del Empleado',
        html: `<div>
      <h1>Acabamos de recibir un email para Atención al cliente</h1>
      <p>Los datos de la consulta son:</p>
      <ul>
        <li>Email: ${email}.</li>
        <li>Nombre: ${name}.</li>
        <li>Teléfono: ${phone}.</li>
        <li>Tipo de consulta: ${service}.</li>
        <li>Consulta: ${message}.</li>
        <li>Consulta: ${date}.</li>
      </ul>  
      <p>Respondan a la consulta a la mayor brevedad posible.</p>
    </div>`
      });
    } catch (error) {
      console.error(error.response.body);
      throw new Error(
        'Error enviando mail a Atencion al cliente. Inténtalo de nuevo más tarde.'
      );
    }

    res.send({
      status: 'ok',
      message: `Hemos registrado su consulta en el Portal del Empleado, en breve se podrán en contacto con usted para resolversela`,
      data: {
        email: email,
        name: name,
        phone: phone,
        questionType: service,
        message: message,
        date: date
      }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = makeQuestion;
