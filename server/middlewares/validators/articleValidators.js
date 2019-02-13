import Joi from 'joi';
import errorResponse from '../../helpers/errorHelpers';
import { articleSchema, ratingSchema } from './validationSchemas';

const validate = schema => (req, res, next) => {
  const { error } = Joi.validate(req.body, schema);
  if (error) {
    const { message: errorMessage } = error.details[0];
    return errorResponse(res, 400, errorMessage);
  }
  next();
};

export const validateArticle = validate(articleSchema);
export const validateRating = validate(ratingSchema);
