import { HTTPException } from 'hono/http-exception.ts'
// import { errorsList } from '#utils/errors.codes.ts';

const errorsList = {'AUTH-NA-10': 'The user, app or Api Key not authenticated',};

export default class InternalValidation extends HTTPException {
  public error!: { code: string; message: string; };

  constructor(code: keyof typeof errorsList, status = 400 ) {
    const message = errorsList[code];
    super(status, { message });
    this.error = { code, message };
  }

  getResponse(): Response {
    if (this.res) {
      return this.res
    }
    return Response.json(this.error, {
      status: this.status,
    })
  }
}