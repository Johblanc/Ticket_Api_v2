const express = require('express') ;

const authenticateJWT = require('../middleware/auth') ;
const TicketsController = require('../controllers/ticketsController');

const ticketsRouter = express.Router() ;
const ticketsController = new TicketsController()

ticketsRouter.get('/'       , authenticateJWT , ticketsController.getAll)

ticketsRouter.get('/:id'    , authenticateJWT , ticketsController.getById)

ticketsRouter.post('/'      , authenticateJWT , ticketsController.newTicket)

ticketsRouter.put('/'       , authenticateJWT , ticketsController.changeTicket)

ticketsRouter.delete('/:id' , authenticateJWT , ticketsController.deleteTicket)

module.exports = ticketsRouter;