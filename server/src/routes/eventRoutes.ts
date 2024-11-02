import express from 'express'
import { createEvent, getUserEvents, updateEvent, deleteEvent } from '../controllers/eventController'

const router = express.Router()

router.post('/', createEvent)        
router.get('/:userId', getUserEvents)
router.put('/:eventId', updateEvent)     
router.delete('/:eventId', deleteEvent)  

export default router
