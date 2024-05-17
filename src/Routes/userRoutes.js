import * as userService from "../services/userService.js";

async function userRoutes(fastify, options) {
  fastify.get("/", userService.getAllUsers);
  fastify.get("/:id", userService.getUserById);
  fastify.post("/", userService.createUser);
  fastify.put("/:id", userService.updateUser);
  fastify.delete("/:id", userService.deleteUser);
}

export default userRoutes;
