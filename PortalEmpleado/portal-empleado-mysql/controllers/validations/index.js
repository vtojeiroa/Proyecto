'use strict';

const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

const { generateError } = require('../../helpers');
/* const { required } = require('@hapi/joi');
 */
// Basic Schemas

const activeSchema = Joi.number()
  .valid(1, 0)
  .error(
    generateError(
      'El campo activo sólo puede tener los valores 0 (desactivado) o 1 (activado)',
      400
    )
  );

const addressSchema = Joi.string()
  .max(255)
  .error(
    generateError('La dirección no puede tener más de 255 caracteres', 400)
  );

const birthdateSchema = Joi.date().error(
  generateError(
    `La fecha de nacimiento es obligatoria y debe tener el formato dd-mm-yyyy`,
    400
  )
);

const countrySchema = Joi.string()
  .max(255)
  .error(generateError('El pais no puede tener más de 255 caracteres', 400));

const dateSchema = Joi.date().error(
  generateError(`El formato correcto de La fecha es YYYY-MM-DD HH:MM:SS`, 400)
);

const descriptionSchema = Joi.string()
  .max(500)
  .error(
    generateError('La descripcion no puede tener más de 500 caracteres', 400)
  );

const emailSchema = Joi.string()
  .email()
  .error(
    generateError(
      'El correo electrónico introducido no es válido. Por favor, introduce un correo electrónico válido.',
      400
    )
  );

const headquarterSchema = Joi.string()
  .min(3)
  .max(50)
  .error(generateError('La sede debe de tener entre 3 y 50 carateres', 400));

const locationSchema = Joi.string()
  .max(255)
  .error(
    generateError('La localidad no puede tener más de 255 caracteres', 400)
  );

const nameSchema = Joi.string()
  .max(255)
  .error(generateError('El nombre no puede tener más de 255 caracteres', 400));

const passwordSchema = Joi.string()
  .min(6)
  .max(100)
  .required()
  .error(
    generateError('La contraseña debe de tener entre 6 y 100 carateres', 400)
  );

const phoneSchema = Joi.string()
  .max(12)
  .error(
    generateError(`El teléfono debe de tener 12 caracteres como máximo`, 400)
  );

const postalCodeSchema = Joi.number()
  .min(5)
  .integer()
  .error(generateError(`El código postal está formado por 5 números`, 400));

const provinceSchema = Joi.string()
  .max(255)
  .error(
    generateError('La provincia no puede tener más de 255 caracteres', 400)
  );

const searchSchema = Joi.string()
  .min(3)
  .max(50)
  .error(
    generateError(
      `El campo de busqueda debe de tener entre 3 y 50 caracteres`,
      400
    )
  );

const serviceSchema = Joi.string()
  .valid('Reserva', 'Incidencia')
  .error(
    generateError(
      `El servicio sólo puede tener los valores 'Reserva' o 'Incidencia'`,
      400
    )
  );

const surnameSchema = Joi.string()
  .max(255)
  .error(
    generateError('El apellido no puede tener más de 255 caracteres', 400)
  );

const typeSchema = Joi.string()
  .min(3)
  .max(50)
  .error(
    generateError(
      'El campo tipo no puede tener menos de 3 ni más de 50 caracteres',
      400
    )
  );

// Object Schemas

const attentionSchema = Joi.object().keys({
  email: emailSchema.error(
    generateError(
      'El correo electrónico es obligatorio. Por favor, introduce un correo electrónico válido',
      400
    )
  ),
  emailRepeat: Joi.any()
    .valid(Joi.ref('email'))
    .error(generateError('Los correos electrónicos deben de ser iguales', 400)),
  name: nameSchema.error(
    generateError(
      'El nombre es obligatorio y debe de tener 255 caracteres como máximo',
      400
    )
  ),
  phone: phoneSchema.error(
    generateError(
      'El teléfono es obligatorio y debe de tener 10 caracteres como máximo',
      400
    )
  ),
  service: typeSchema,
  message: descriptionSchema
});

const createAssignmentSchema = Joi.object().keys({
  headquarter: headquarterSchema
    .required()
    .error(
      generateError(
        'La Sede es obligatoria y debe tener entre 3 y 50 caracteres',
        400
      )
    ),
  service_type: typeSchema
    .required()
    .error(
      generateError(
        `El tipo es obligatorio y debe tener entre 3 y 50 caracteres`,
        400
      )
    ),
  disponibility: Joi.number()
    .integer()
    .min(0)
    .required()
    .error(
      generateError(
        'La disponibilidad es obligatoria y tiene que ser un número igual o mayor que cero',
        400
      )
    )
});
const createHeadquarterSchema = Joi.object().keys({
  name: nameSchema.required(),
  address: addressSchema.required(),
  postal_code: postalCodeSchema.required(),
  location: locationSchema.required(),
  province: provinceSchema.required(),
  country: countrySchema.required()
});

const createtypeSchema = Joi.object().keys({
  section: serviceSchema.required(),
  type: typeSchema.required(),
  description: descriptionSchema.required()
});

const createServiceSchema = Joi.object().keys({
  active: activeSchema,
  section: serviceSchema.required(),
  type: typeSchema.required(),
  description: descriptionSchema.required()
});

const editEmailUserSchema = Joi.object().keys({
  oldEmail: emailSchema.required(),
  newEmail: emailSchema.required(),
  newEmailRepeat: Joi.any()
    .valid(Joi.ref('newEmail'))
    .error(
      generateError('Los correos electrónico introducidos no coinciden', 400)
    )
});

const editHeadquarterSchema = Joi.object().keys({
  active: activeSchema.required(),
  name: nameSchema.required(),
  address: addressSchema.required(),
  postal_code: postalCodeSchema.required(),
  location: locationSchema.required(),
  province: provinceSchema.required(),
  country: countrySchema.required()
});

const editServiceSchema = Joi.object().keys({
  active: activeSchema,
  section: serviceSchema,
  type: typeSchema,
  description: descriptionSchema
});

const editPasswordUserSchema = Joi.object().keys({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  newPasswordRepeat: Joi.any()
    .valid(Joi.ref('newPassword'))
    .error(generateError('Las contraseñas introducidas no coinciden', 400))
});

const edittypeSchema = Joi.object().keys({
  active: activeSchema.required(),
  section: serviceSchema.required(),
  type: typeSchema.required(),
  description: descriptionSchema.required()
});

const editUserSchema = Joi.object().keys({
  activo: activeSchema,
  name: nameSchema.required(),
  surname: surnameSchema.required(),
  document: Joi.string()
    .max(10)
    .error(
      generateError(
        `Elcampo número documento identidad está compuesto por números y letras, y máximo 10 caracteres`,
        400
      )
    ),
  avatar: Joi.string(),
  address: addressSchema,
  postal_code: postalCodeSchema.required(),
  location: locationSchema,
  province: provinceSchema,
  country: countrySchema,
  phone: phoneSchema,
  birthdate: birthdateSchema.required(),
  headquarters: headquarterSchema
});

const entryVotesSchema = Joi.object().keys({
  service: serviceSchema.required(),
  type: typeSchema.required()
});

const incidenceSchema = Joi.object().keys({
  incidenceType: typeSchema.required(),
  description: descriptionSchema.required()
});

const recoveryPasswordSchema = Joi.object().keys({
  email: emailSchema.required(),
  postal_code: postalCodeSchema.required(),
  birthdate: birthdateSchema
});

const reserveSchema = Joi.object().keys({
  reserveType: typeSchema,
  dateInit: dateSchema,
  dateEnd: dateSchema
    .greater(Joi.ref('dateInit'))
    .error(
      generateError('La fecha final tiene que ser superior a la inicial', 400)
    ),
  commentary: descriptionSchema
});

const searchDateSchema = Joi.object().keys({
  date_init: Joi.date(),
  date_end: Joi.date()
    .greater(Joi.ref('date_init'))
    .error(
      generateError('La fecha final tiene que ser superior a la inicial', 400)
    )
});

const userLoginSchema = Joi.object().keys({
  email: emailSchema.required(),
  password: passwordSchema.required()
});

const userSchema = Joi.object().keys({
  name: nameSchema.required(),
  surname: nameSchema.required(),
  email: emailSchema.required(),
  password: passwordSchema.required(),
  headquarter: headquarterSchema.required()
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
  attentionSchema,
  createAssignmentSchema,
  createHeadquarterSchema,
  createServiceSchema,
  createtypeSchema,
  editEmailUserSchema,
  editHeadquarterSchema,
  editServiceSchema,
  editPasswordUserSchema,
  edittypeSchema,
  editUserSchema,
  entryVotesSchema,
  incidenceSchema,
  recoveryPasswordSchema,
  reserveSchema,
  searchDateSchema,
  searchSchema,
  userLoginSchema,
  userSchema,
  voteSchema
};
