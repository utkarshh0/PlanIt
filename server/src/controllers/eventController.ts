import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
    const { title, description, startDate, endDate, userId } = req.body

    try {
        const event = await prisma.event.create({
            data: {
                title,
                description,
                startDate,
                endDate,
                user: { connect: { id: userId } }, // Connect the event to the user
            },
        })
        res.status(201).json(event)
    } catch (error) {
        console.error(error) // Log the error for debugging
        res.status(500).json({ error: 'Failed to create event' })
    }
}

export const getUserEvents = async (req: Request, res: Response) => {
    const { userId } = req.params
  
    try {
      const events = await prisma.event.findMany({
        where: {
          userId: Number(userId)
        },
      })
      res.status(200).json(events)
    } catch (error) {
      console.error('Error fetching events:', error)
      res.status(500).json({ error: 'Failed to fetch events' })
    }
  }
  

// Update an event by ID
export const updateEvent = async (req: Request, res: Response) : Promise<any> => {
    const { id, title, description, startDate, endDate } = req.body

    // Basic validation
    console.log("logged", id, title, description, startDate, endDate);
    if (!id || !title || !description || !startDate || !endDate) {
        return res.status(400).json({ error: 'All fields are required' })
    }

    try {
        const event = await prisma.event.update({
            where: { id: Number(id) },
            data: { title, description, startDate, endDate },
        })
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event' })
    }
}

// Delete an event by ID
export const deleteEvent = async (req: Request, res: Response) : Promise<any> => {
    const { eventId } = req.params

    // Basic validation
    if (!eventId) {
        return res.status(400).json({ error: 'ID is required' })
    }

    try {
        const event = await prisma.event.delete({ where: { id: Number(eventId) } })
        res.status(204).send() // No content to send back
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' })
    }
}

