'use strict';

module.exports.general = {
    success: {code: 1, status: 200, description: 'Success'},
    badRequest: {code: 2, status: 400, description: 'Missing or invalid request'},
    unauthorized: {code: 3, status: 403, description: 'Unauthorized access to requested resource'},
    notFound: {code: 4, status: 404, description: 'Requested resource cannot be found'},
    notAllowed: {code: 5, status: 200, description: 'Attempted action is not allowed'},
    unprocessableEntity: {code: 6, status: 422, description: 'Unprocessable response received'},
    internalServerError: {code: 7, status: 500, description: 'Internal server error'}
}