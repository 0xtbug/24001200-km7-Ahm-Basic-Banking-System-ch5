// https://stackoverflow.com/questions/62474575/not-generating-swagger-document-node-js-swaggerjsdoc

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    swagger: '2.0',
    schemes: ["http", "https"],
    info: {
      title: 'Banking System API',
      version: '1.0.0',
      description: 'API documentation for the Banking System',
    },
    basePath: '/api/v1',
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Enter your bearer token in the format "Bearer {token}"',
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs; 