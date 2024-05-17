//import my Routes
import * as userRoutes from "./src/routes/userRoutes.js";
import { dbConnection } from "./src/models/connection.js";
import Fastify from "fastify";
import fastifyWebsocket from "fastify-websocket";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

const fastify = Fastify({
  logger: true,
});
fastify.register(fastifyWebsocket);

fastify.register(fastifySwagger, {
  routePrefix: "/docs",
  exposeRoute: true,
  swagger: {
    info: {
      title: "User Directory and Profile",
      description: "Demonstrates Fastify with authenticated route using RSA256",
      version: "1.0.0",
    },
    tags: [
      {
        name: "user",
        description: "Endpoints for managing users",
      },
    ],
    paths: {
      "/users": {
        get: {
          tags: ["user"],
          summary: "Get users",
          description: "Endpoint to get users",
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        _id: { type: "string" },
                        username: { type: "string" },
                        email: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["user"],
          summary: "Create user",
          description: "Endpoint to create a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    email: { type: "string" },
                  },
                  required: ["username", "email"],
                },
              },
            },
          },
          responses: {
            201: {
              description: "User created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      _id: { type: "string" },
                      username: { type: "string" },
                      email: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/users/{id}": {
        get: {
          tags: ["user"],
          summary: "Get user by ID",
          description: "Endpoint to get user by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              description: "ID of the user to get",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      _id: { type: "string" },
                      username: { type: "string" },
                      email: { type: "string" },
                    },
                  },
                },
              },
            },
            404: {
              description: "User not found",
            },
          },
        },
        delete: {
          tags: ["user"],
          summary: "Delete user by ID",
          description: "Endpoint to delete user by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              description: "ID of the user to delete",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            204: {
              description: "User deleted successfully",
            },
            404: {
              description: "User not found",
            },
          },
        },
      },
    },
  },
});

// Register Swagger UI
fastify.register(fastifySwaggerUI, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

//start to server
fastify.register(userRoutes, { prefix: "/users" });

fastify.get("/hello", (request, reply) => {
  reply.send({
    message: "Hello Fastify",
  });
});

fastify.get("/hello-ws", { websocket: true }, (connection, req) => {
  // Client connect
  console.log("Client connected");
  // Client message
  connection.socket.on("message", (message) => {
    console.log(`Client message: ${message}`);
  });
  // Client disconnect
  connection.socket.on("close", () => {
    console.log("Client disconnected");
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info("server is Running");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
dbConnection();
