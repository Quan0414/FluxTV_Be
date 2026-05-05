import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'IPTV Backend API',
      version: '1.0.0',
      description: 'REST API cung cấp dữ liệu kênh TV trực tiếp cho Ứng dụng Android',
      contact: {
        name: 'Developer'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  // Đường dẫn tới các file chứa comment Swagger
  apis: ['./src/routes/*.js', './src/server.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export default swaggerDocs;
