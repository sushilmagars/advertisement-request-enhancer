'use strict';

class AppCtrl {
    static sendResponse(res, statusCode, contentType, content) {
        if (contentType === JSON) {
            return res.status(statusCode).json(content);
        } else {
            return res.status(statusCode).send(content);
        }
    }
 
    static handleErrorResponse(res, statusCode, contentType, content) {
        if (contentType === JSON) {
            return res.status(statusCode).json(content);
        } else {
            return res.status(statusCode).send(content);
        }
    }
}

module.exports = AppCtrl;