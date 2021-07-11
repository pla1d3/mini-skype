import Joi from '@hapi/joi';

export default Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Заполните поле',
      'string.email': 'Не валидный email'
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Заполните поле'
    })
});
