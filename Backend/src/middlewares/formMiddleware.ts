import formidable, { type Part } from 'formidable';
import type { RequestHandler } from 'express';

const filter = ({ mimetype }: Part) => {
  if (!mimetype || !mimetype.includes('image')) throw new Error('Only images are allowed', { cause: { status: 400 } });
  return true;
};

//10mb
const maxFileSize = 10 * 1024 * 1024;

const formMiddleWare: RequestHandler = (request, response, next) => {
  if (request.headers['content-type']?.includes('multipart/form-data')) {
    const form = formidable({ multiples: true, filter, maxFileSize });

    form.parse(request, (error, fields, files) => {
      if (error) {
        next(error);
        return;
      }

      // console.log(fields);

      // console.log(files);

      if (!files || !files.pictureURL) throw new Error('Please upload a file', { cause: { status: 400 } });

      const fileArray = Array.isArray(files.pictureURL) ? files.pictureURL : [files.pictureURL];

      request.body = fields;
      request.pictureURL = fileArray;

      next();
    });
  } else {
    next(new Error('Expected multipart/form-data', { cause: { status: 400 } }));
  }
};

export default formMiddleWare;
