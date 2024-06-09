"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
// Function to dynamically generate routes with headings
const generateSwaggerPaths = () => {
    const routes = {};
    const basePath = path_1.default.join(__dirname, '../routes');
    fs_1.default.readdirSync(basePath).forEach(file => {
        const routePath = path_1.default.join(basePath, file);
        if (fs_1.default.statSync(routePath).isFile()) {
            const routeName = path_1.default.parse(routePath).name;
            routes[`/${routeName}`] = {
                title: `${routeName.charAt(0).toUpperCase() + routeName.slice(1)} Routes`
            };
        }
    });
    return routes;
};
const swaggerOptions = {
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
const swaggerSpecs = (0, swagger_jsdoc_1.default)(swaggerOptions);
router.use('/', swagger_ui_express_1.default.serve);
router.get('/', swagger_ui_express_1.default.setup(swaggerSpecs));
exports.default = router;
