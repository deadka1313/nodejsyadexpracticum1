import HTTPStatus from 'http-status';

export interface IError extends Error {
  statusCode?: number;
}

export default class CustomError extends Error implements IError {
  public statusCode: number;

  constructor(status: number, message: string) {
    super(message);
    this.statusCode = status;
  }

  static NotFoundError(message: string) {
    return new CustomError(HTTPStatus.NOT_FOUND, message);
  }

  static BadRequest(message: string) {
    return new CustomError(HTTPStatus.BAD_REQUEST, message);
  }
}
