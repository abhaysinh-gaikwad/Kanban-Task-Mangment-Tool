import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Function to dynamically generate routes with headings
const generateSwaggerPaths = () => {
  const routes: Record<string, any> = {};
  const basePath = path.join(__dirname, '../routes');
  fs.readdirSync(basePath).forEach(file => {
    const routePath = path.join(basePath, file);
    if (fs.statSync(routePath).isFile()) {
      const routeName = path.parse(routePath).name;
      routes[`/${routeName}`] = {
        title: `${routeName.charAt(0).toUpperCase() + routeName.slice(1)} Routes`
      };
    }
  });
  return routes;
};
const swaggerOptions: swaggerJSDoc.Options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API documentation for the Express.js application',
      },
      servers: [
        {
          url: 'http://localhost:4000',
          description: 'Local server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          Task: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '60d21b4667d0d8992e610c85' },
              title: { type: 'string', example: 'Task Title' },
              description: { type: 'string', example: 'Task Description' },
              status: { type: 'string', example: 'Pending' },
              boardId: { type: 'string', example: '60d21b4367d0d8992e610c82' },
              subtaskId: { type: 'string', example: '60d21b4767d0d8992e610c88' },
              createdAt: { type: 'string', format: 'date-time', example: '2021-06-22T14:48:22.206Z' },
              updatedAt: { type: 'string', format: 'date-time', example: '2021-06-22T14:48:22.206Z' }
            }
          },
          Subtask: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '60d21b4667d0d8992e610c86' },
              title: { type: 'string', example: 'Subtask Title' },
              isCompleted: { type: 'boolean', example: false },
              taskId: { type: 'string', example: '60d21b4667d0d8992e610c85' },
              createdAt: { type: 'string', format: 'date-time', example: '2021-06-22T14:48:22.206Z' },
              updatedAt: { type: 'string', format: 'date-time', example: '2021-06-22T14:48:22.206Z' }
            }
          },
          Board: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '60d21b4367d0d8992e610c82' },
              name: { type: 'string', example: 'Board Name' },
              tasks: {
                type: 'array',
                items: { type: 'string', example: '60d21b4667d0d8992e610c85' }
              },
              createdAt: { type: 'string', format: 'date-time', example: '2021-06-22T14:48:22.206Z' },
              updatedAt: { type: 'string', format: 'date-time', example: '2021-06-22T14:48:22.206Z' }
            }
          },
          User: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '60d21b4967d0d8992e610c90' },
              name: { type: 'string', example: 'John Doe' },
              email: { type: 'string', example: 'john.doe@example.com' },
              password: { type: 'string', example: 'securepassword' },
              tasks: {
                type: 'array',
                items: { type: 'string', example: '60d21b4667d0d8992e610c85' }
              },
              createdAt: { type: 'string', format: 'date-time', example: '2021-06-22T14:48:22.206Z' },
              updatedAt: { type: 'string', format: 'date-time', example: '2021-06-22T14:48:22.206Z' }
            }
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    },
    apis: ['./routes/*.ts']
  };
  

const paths = generateSwaggerPaths();
Object.assign(swaggerOptions, { paths });

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpecs));

export default router;
