'use strict';

const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

const { generateError } = require('../../helpers');

// Basic Schemas

const activeSchema = Joi.number()
  .allow('1', '0')
  .error(
    generateError(
      'El campo activosolo puede tener los valores 0 (desactivado) o 1 (activado)',
      400
    )
  );

const dateSchema = Joi.date()
  .required()
  .error(
    generateError(
      `El campo fecha es obligatorio y el formato es YYYY-MM-DD HH:MM:SS`,
      400
    )
  );

const descriptionSchema = Joi.string()
  .max(500)
  .required()
  .error(
    generateError(
      'El campo description es obligatorio y no puede tener más de 500 caracteres',
      400
    )
  );

const emailSchema = Joi.string()
  .email()
  .required()
  .error(generateError('El campo email debe ser un email bien formado', 400));

const headquarterSchema = Joi.string()
  .min(3)
  .max(50)
  .required()
  .error(
    generateError(
      'El campo Sede es obligatorio y debe de tener entre 3 y 50 carateres',
      400
    )
  );

const nameSchema = Joi.string()
  .max(255)
  .error(generateError('El nombre no puede pasar de 255 caracteres', 400));

const passwordSchema = Joi.string()
  .min(6)
  .max(100)
  .required()
  .error(
    generateError('La password debe de tener entre 6 y 100 carateres', 400)
  );

const phoneSchema = Joi.string()
  .max(12)
  .error(
    generateError(`El campo teléfono debe de tener 12 caracteres como máximo`)
  );

const postalCodeSchema = Joi.number()
  .integer()
  .error(generateError(`El campo código postal está formado por 5 números`));

const searchSchema = Joi.string()
  .min(2)
  .required()
  .error(
    generateError('El campo de búsqueda debe de tener más de 2 caracteres', 400)
  );

const sectionSchema = Joi.string()
  .valid('Reserva', 'Incidencia')
  .required()
  .error(
    generateError(
      'El campo seccion es obligatorio y solo puede tener los valores Reserva o Incidencia',
      400
    )
  );

const serviceSchema = Joi.string()
  .min(3)
  .max(50)
  .required()
  .error(
    generateError(
      'El campo reserva/incidencia es obligatorio y no puede tener menos de 3 ni más de 50 caracteres',
      400
    )
  );

// Object Schemas

const attentionSchema = Joi.object().keys({
  email: emailSchema,
  emailRepeat: Joi.any()
    .valid(Joi.ref('email'))
    .error(generateError('Los emails deben ser iguales', 400)),
  name: nameSchema,
  phone: phoneSchema,
  service_type: sectionSchema,
  message: descriptionSchema
});

const createAssignmentSchema = Joi.object().keys({
  headquarter: headquarterSchema,
  service_type: serviceSchema,
  disponibility: Joi.number()
    .integer()
    .min(0)
    .required()
    .error(
      generateError(
        'El campo disponibilidad es obligatorio y tiene que ser un número igual o mayor que cero',
        400
      )
    )
});
const createHeadquarterSchema = Joi.object().keys({
  name: nameSchema,
  address: nameSchema,
  postal_code: postalCodeSchema,
  location: nameSchema,
  province: nameSchema,
  country: nameSchema
});

const createServiceSchema = Joi.object().keys({
  section: sectionSchema,
  type: serviceSchema,
  description: descriptionSchema
});

const editHeadquarterSchema = Joi.object().keys({
  active: activeSchema,
  name: nameSchema,
  address: nameSchema,
  postal_code: postalCodeSchema,
  location: nameSchema,
  province: nameSchema,
  country: nameSchema
});

const editIncidenceSchema = Joi.object().keys({
  description: descriptionSchema
});

const editPasswordUserSchema = Joi.object().keys({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  newPasswordRepeat: Joi.any()
    .valid(Joi.ref('newPassword'))
    .error(generateError('Las passwords debe ser iguales', 400))
});

const editServiceSchema = Joi.object().keys({
  active: activeSchema,
  section: sectionSchema,
  type: serviceSchema,
  description: descriptionSchema
});

const editUserSchema = Joi.object().keys({
  name: nameSchema,
  surname: nameSchema,
  identification_document: Joi.string()
    .max(10)
    .error(
      generateError(
        `Elcampo número documento identidad está compuesto por números y letras, y máximo 10 caracteres`
      )
    ),
  email: emailSchema,
  avatar: Joi.string(),
  address: nameSchema,
  postal_code: postalCodeSchema,
  location: nameSchema,
  province: nameSchema,
  country: nameSchema,
  phone: phoneSchema,
  birthdate: Joi.date().error(
    generateError(`El campo birthdate debe tener el formato yyyy-mm-dd`)
  ),
  headquarters: Joi.string()
    .min(3)
    .max(50)
    .error(
      generateError('El campo Sede debe de tener entre 3 y 50 carateres', 400)
    )
});

const incidenceSchema = Joi.object().keys({
  incidenceType: serviceSchema,
  description: descriptionSchema
});

const recoveryPasswordSchema = Joi.object().keys({
  email: emailSchema,
  postal_code: postalCodeSchema,
  birthdate: Joi.date().error(
    generateError(`El campo birthdate debe tener el formato yyyy-mm-dd`, 400)
  )
});

const reserveSchema = Joi.object().keys({
  reserveType: serviceSchema,
  dateInit: dateSchema,
  dateEnd: dateSchema
    .greater(Joi.ref('dateInit'))
    .error(generateError('La fecha final tiene que ser superior a la inicial')),
  commentary: descriptionSchema
});

const userLoginSchema = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema
});

const userSchema = Joi.object().keys({
  name: nameSchema,
  surname: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  headquarter: Joi.string()
    .min(3)
    .max(50)
    .required()
    .error(
      generateError(
        'El campo Sede es obligatorio y debe de tener entre 3 y 50 carateres',
        400
      )
    )
});

const voteSchema = Joi.object().keys({
  vote: Joi.number()
    .min(1)
    .max(5)
    .integer()
    .required()
    .error(
      generateError(
        'El campo voto debe existir y ser un número entre 1 y 5',
        400
      )
    ),
  description: descriptionSchema
});

module.exports = {
  reserveSchema,
  incidenceSchema,
  voteSchema,
  searchSchema,
  userSchema,
  userLoginSchema,
  editUserSchema,
  editPasswordUserSchema,
  editIncidenceSchema,
  recoveryPasswordSchema,
  createServiceSchema,
  editServiceSchema,
  createHeadquarterSchema,
  editHeadquarterSchema,
  createAssignmentSchema,
  attentionSchema
};
