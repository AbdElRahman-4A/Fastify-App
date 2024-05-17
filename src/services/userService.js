import { userModel } from "../models/user.model.js";

async function getAllUsers(request, reply) {
  try {
    const users = await userModel.find();
    reply.send({ message: "success", users });
  } catch (error) {
    reply.status(500).send(error);
  }
}
async function getUserById(request, reply) {
  try {
    const user = await userModel.findById(request.params.id);
    reply.send({ message: "success", user });
  } catch (error) {
    reply.status(500).send(error);
  }
}
async function createUser(request, reply) {
  try {
    const user = new userModel(request.body);
    const result = await user.save();
    reply.send({ message: "success", result });
  } catch (error) {
    reply.status(500).send(error);
  }
}
async function updateUser(request, reply) {
  try {
    const user = await userModel.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
      }
    );
    reply.send({ message: "success", user });
  } catch (error) {
    reply.status(500).send(error);
  }
}
async function deleteUser(request, reply) {
  try {
    await userModel.findByIdAndDelete(request.params.id);
    reply.status(203).send({ message: "success" });
  } catch (error) {
    reply.status(500).send(error);
  }
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
