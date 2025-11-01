import { body, ValidationChain } from 'express-validator';

export const addToWaitlistValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .trim(),
];

