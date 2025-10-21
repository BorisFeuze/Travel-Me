import formidable, { type Part } from 'formidable';
import type { RequestHandler } from 'express';

const filter = ({ mimetype }: Part) => {
  if (!mimetype || !mimetype.includes('image'))
    throw new Error('Only images are allowed', { cause: { status: 400 } });
  return true;
};

//10mb
const maxFileSize = 10 * 1024 * 1024;

const formMiddleWare: RequestHandler = (request, response, next) => {
  const form = formidable({ filter, maxFileSize });

  form.parse(request, (error, fields, files) => {
    if (error) {
      next(error);
      return;
    }

    if (!files || !files.image) throw new Error('Please upload a file', { cause: { status: 400 } });

    request.body = fields;
    request.image = files.image[0];

    next();
  });
};

export default formMiddleWare;
