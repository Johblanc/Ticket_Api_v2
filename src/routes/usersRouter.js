const express = require('express');
const UsersController = require('../controllers/usersController');


const usersRouter = express.Router();
const usersController = new UsersController()

usersRouter.post('/register',usersController.register)

usersRouter.post('/login', usersController.login)

module.exports = usersRouter;