import boom from "@hapi/boom";

export default boom.Boom;

export const notFound = (message = "Not Found") => boom.notFound(message);

export const unauthorized = (message = "Unauthorized") => boom.unauthorized(message);

export const forbidden = (message = "Forbidden") => boom.forbidden(message);

export const badData = (message = "Bad Data") => boom.badData(message);

export const badRequest = (message = "Bad Request") => boom.badRequest(message);

export const internalServerError = (message = "Internal Server Error") => boom.internal(message);
