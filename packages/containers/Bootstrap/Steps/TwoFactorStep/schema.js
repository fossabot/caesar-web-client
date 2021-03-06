import * as yup from 'yup';

export const codeSchema = yup.object().shape({
  code: yup.number().required(),
});

export const agreeSchema = yup.object().shape({
  agreeCheck: yup.bool().required(),
});
