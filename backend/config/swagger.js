const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'LogiTrack API',
    version: '1.0.0',
    description: 'RESTful API documentation and interactive testing sandbox for the LogiTrack Multi-Role Logistics & Supply Chain Tracking System.',
    contact: {
      name: 'LogiTrack Support'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '662bfe1a8a2d123456789abc' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          role: {
            type: 'string',
            enum: ['client', 'warehouse', 'distributor', 'delivery', 'delivery_person', 'admin'],
            example: 'client'
          }
        }
      },
      Package: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '662bfe1a8a2d123456789def' },
          packageId: { type: 'string', example: 'PKG-2026-0001' },
          client: { $ref: '#/components/schemas/User' },
          senderName: { type: 'string', example: 'Rajesh Sharma' },
          senderPhone: { type: 'string', example: '+91 9876543210' },
          pickupAddress: { type: 'string', example: '12 MG Road, Indiranagar' },
          receiverName: { type: 'string', example: 'Priya Patel' },
          receiverPhone: { type: 'string', example: '+91 9123456780' },
          deliveryAddress: { type: 'string', example: '45 Bandra West' },
          originCity: { type: 'string', example: 'Bengaluru' },
          destinationCity: { type: 'string', example: 'Mumbai' },
          description: { type: 'string', example: 'Electronics components' },
          weight: { type: 'number', example: 2.5 },
          dimensions: {
            type: 'object',
            properties: {
              length: { type: 'number', example: 15 },
              width: { type: 'number', example: 10 },
              height: { type: 'number', example: 8 }
            }
          },
          priority: {
            type: 'string',
            enum: ['Standard', 'Express', 'Urgent'],
            example: 'Standard'
          },
          status: {
            type: 'string',
            enum: [
              'REQUEST_CREATED',
              'WAREHOUSE_RECEIVED',
              'PACKAGE_PROCESSED',
              'DISTRIBUTOR_RECEIVED',
              'ASSIGNED_FOR_DELIVERY',
              'OUT_FOR_DELIVERY',
              'DELIVERED'
            ],
            example: 'REQUEST_CREATED'
          },
          flowType: {
            type: 'string',
            enum: ['standard', 'express'],
            example: 'standard'
          },
          assignedDeliveryPerson: {
            type: 'string',
            nullable: true,
            example: null
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      PackageHistory: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '662bfe1a8a2d123456789ghi' },
          packageId: { type: 'string', example: 'PKG-2026-0001' },
          status: { type: 'string', example: 'WAREHOUSE_RECEIVED' },
          updatedBy: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '662bfe1a8a2d123456789abc' },
              name: { type: 'string', example: 'Warehouse Admin' },
              role: { type: 'string', example: 'warehouse' }
            }
          },
          comments: { type: 'string', example: 'Package received at warehouse facility.' },
          location: { type: 'string', example: 'Warehouse Intake' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' }
        }
      },
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error message description' }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, '../routes/*.js'),
    './routes/*.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
