export class NotFoundException extends Error {
  status: number;
  message: string;
  constructor(message: string = 'Not Found', status: number = 400) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
