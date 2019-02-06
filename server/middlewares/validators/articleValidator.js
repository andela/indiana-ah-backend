import Joi from 'joi';
import errorResponse from '../../helpers/errorHelpers';

const schema = {
  articleTitle: Joi.string()
    .min(5)
    .required(),
  articleBody: Joi.string()
    .min(10)
    .required(),
  tags: Joi.string().min(2),
  imageUrl: Joi.string().uri()
};

const validateArticle = (req, res, next) => {
  const { error } = Joi.validate(req.body, schema);
  if (error) {
    const { message: errorMessage } = error.details[0];
    return errorResponse(res, 400, errorMessage);
  }
  next();
};

export default validateArticle;
