'use strict';
const API_BASE = require('./config/environment').API_BASE;
const path = require('path');

module.exports = (app) => {
    const mountRoute = (route) => {
        return require(path.resolve(__dirname, 'src/components', route));
    }

    mountRoute('advertisement/advertisement.routes');
    
    // Respond with 404 for all other routes
    app.use((req, res, next) => {
        if (!res.headersSent) {
            return res.status(404).send('Not found');
        }
        
        next();
    });
}