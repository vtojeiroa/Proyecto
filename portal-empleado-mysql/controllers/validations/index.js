const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

const { generateError } = require('../../helpers');

// Basic Schemas
const searchSchema = Joi.string()
  .min(2)
  .required()
  .error(
    generateError(
      'El campo de búsqueda debe de ser de máis de 2 caracteres',
      400
    )
  );

const nameSchema = Joi.string()
  .max(255)
  .error(generateError('El nombre no puede pasar de 255 caracteres', 400));

const emailSchema = Joi.string()
  .email()
  .required()
  .error(generateError('El campo email debe ser un email bien formado', 400));

const passwordSchema = Joi.string()
  .min(6)
  .max(100)
  .required()
  .error(
    generateError('La password debe de tener entre 6 y 100 carateres', 400)
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
const dateSchema = Joi.date()
  .required()
  .error(
    generateError(
      `El campo fecha es obligatorio y el formato es YYYY-MM-DD HH:MM`,
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
const reserveSchema = Joi.object().keys({
  reserveType: serviceSchema,
  dateInit: dateSchema,
  dateEnd: dateSchema
    .greater(Joi.ref('dateInit'))
    .error(generateError('La fecha final tiene que ser superior a la inicial')),
  commentary: descriptionSchema
});

const incidenceSchema = Joi.object().keys({
  incidenceType: serviceSchema,
  description: descriptionSchema
});

const editIncidenceSchema = Joi.object().keys({
  description: descriptionSchema
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

const userLoginSchema = Joi.object().keys({
  email: emailSchema,
  password: passwordSchema
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
  email: Joi.string()
    .email()
    .error(generateError('El campo email debe ser un email bien formado', 400)),
  avatar: Joi.string(),
  address: nameSchema,
  postal_code: Joi.number()
    .integer()
    .error(generateError(`El campo código postal está formado por números`)),
  location: nameSchema,
  province: nameSchema,
  country: nameSchema,
  phone: Joi.string()
    .max(12)
    .error(
      generateError(`El campo teléfono debe de tener 12 caracteres como máximo`)
    ),
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

const editPasswordUserSchema = Joi.object().keys({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  newPasswordRepeat: Joi.any()
    .valid(Joi.ref('newPassword'))
    .error(generateError('Las passwords debe ser iguales', 400))
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
  editIncidenceSchema
};
