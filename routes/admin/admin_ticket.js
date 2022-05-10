const express = require('express')
const router = express.Router()
const ticketController = require('../../app/controller/ticketController')


//将路由挂到路由对象上
router.post('/create', ticketController.insertTicket)
router.post('/transfer', ticketController.transferTicket)
router.post('/list', ticketController.getTicketsList)
router.get('/details', ticketController.getTicketdetails)
router.post('/distribute', ticketController.distributeTicket)
router.post('/delete', ticketController.deleteTicket)
router.post('/complete', ticketController.completeTicket)
router.get('/category', ticketController.getTicketCategoryList)


module.exports = router