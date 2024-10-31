import express from 'express'
import { createEvent, getUserEvents, updateEvent, deleteEvent } from '../controllers/eventController'

const router = express.Router()

router.post('/', createEvent)        
router.get('/', getUserEvents)
router.put('/', updateEvent)     
router.delete('/', deleteEvent)  

export default router
