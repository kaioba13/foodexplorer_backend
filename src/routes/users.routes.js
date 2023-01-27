const { Router } = require("express");

const UserController = require("../controllers/UserController");

const userController = new UserController();

const usersRoutes = Router();

usersRoutes.post("/", userController.create);

module.exports = usersRoutes;
