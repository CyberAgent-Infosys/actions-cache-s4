export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class ApiRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiRequestError';
    Object.setPrototypeOf(this, ApiRequestError.prototype);
  }
}

export class FileStreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileStreamError';
    Object.setPrototypeOf(this, FileStreamError.prototype);
  }
}

export class ArchiveFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArchiveFileError';
    Object.setPrototypeOf(this, ArchiveFileError.prototype);
  }
}
