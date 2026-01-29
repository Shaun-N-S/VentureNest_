export class ApplicationException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundExecption extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class AlreadyExisitingExecption extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class IsBlockedExecption extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidOTPExecption extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class DataMissingExecption extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}
export class PasswordNotMatchingException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class TokenExpiredException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class TokenMissingException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class OTPExpiredException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidDataException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}
