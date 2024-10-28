export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequest extends ApiError {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

export class NotFound extends ApiError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export class Unauthorized extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class UnprocessableEntity extends ApiError {
  constructor(message = 'Unprocessable Entity') {
    super(422, message);
  }
}
