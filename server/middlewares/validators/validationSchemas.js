import Joi from 'joi';

export const articleSchema = {
  articleTitle: Joi.string()
    .min(5)
    .required(),
  articleBody: Joi.string()
    .min(10)
    .required(),
  tags: Joi.string().min(2),
  imageUrl: Joi.string().uri()
};

export const ratingSchema = {
  rating: Joi.number()
    .min(1)
    .max(5)
};
