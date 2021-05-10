const cors = require('cors');


module.exports = cors({
  origin: ['*', 'http://localhost:4200'],
  // Configures the Access-Control-Allow-Methods CORS header.
  methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
  headers: [
    'Origin',
    'Content-Type',
    'Access-Control-Allow-Origin',
    'Authorization',
    'Accept',
  ],
  allowedHeaders: [
    'origin',
    'content-type',
    'Authorization',
  ],
  credentials: true,
  // Configures the Access-Control-Max-Age CORS header.
  maxAge: 3600,
})