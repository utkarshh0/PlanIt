import { useEffect, useState } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { updateEvent, deleteEvent, setEvents } from '../store/eventsSlice'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { EventsState } from '../store/eventsSlice'
import { Skeleton } from "@/components/ui/skeleton"
import { jwtDecode } from "jwt-decode";
import { setUser } from '@/store/userSlice'
import { JwtPayload } from 'jwt-decode'
import { ReloadIcon } from '@radix-ui/react-icons'

const DnDCalendar = withDragAndDrop(Calendar)
const myLocalizer = momentLocalizer(moment)

interface eState {
  events: EventsState
}

interface selectedEvent {
  id: string 
  start: Date
  end: Date
  title: string
  description: string
}

interface CustomJwtPayload extends JwtPayload {
  id: number 
}

const EventPage: React.FC = () => {
  const dispatch = useDispatch()
  const events = useSelector((state: eState) => state.events.events)

  const mappedEvents = events.map(event => ({
    ...event,
    start: new Date(event.startDate),
    end: new Date(event.endDate) 
  }));
  
  const [selectedEvent, setSelectedEvent] = useState<selectedEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchEventsAndUser = async () => {
      try {
        setIsFetching(true)
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No token found')
        }
  
        // Decode the token to get the user ID
        const decoded = jwtDecode<CustomJwtPayload>(token)
        const id = decoded.id
  
        // Fetch events using the user's ID
        const eventResponse = await fetch(`https://planit-amv2.onrender.com/api/event/${id}`, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        })
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch events')
        }
        const eventData = await eventResponse.json()
        dispatch(setEvents(eventData))
  
        // Fetch user data using the same ID
        const userResponse = await fetch(`https://planit-amv2.onrender.com/api/user/get/${id}`, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        })
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data')
        }
        const userData = await userResponse.json()
        dispatch(setUser(userData)) 
  
      } catch (error) {
        console.error('Error fetching events or user data:', error)
      } finally {
        setIsFetching(false)
      }
    }
  
    fetchEventsAndUser()
  }, [dispatch])

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
  }


  const handleEventChange = async ({ start, end, event }: any) =>  {
    const updatedEvent = { ...event, startDate: start, endDate: end }
    try {
      setIsSaving(true)
      const response = await fetch(`https://planit-amv2.onrender.com/api/event/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({
          id: event.id,
          title: updatedEvent.title,
          description: updatedEvent.description,
          startDate: new Date(updatedEvent.start),
          endDate: new Date(updatedEvent.end)
        })
      })
      if (!response.ok) {
        throw new Error('Failed to update event')
      }
      dispatch(updateEvent(updatedEvent))
    } catch (error) {
      console.error('Error updating event:', error)
    } finally{
      setIsSaving(false)
    }
  }


  const handleDeleteEvent = async (eventId: string) => {
    try {
      setIsDeleting(true)
      const response = await fetch(`https://planit-amv2.onrender.com/api/event/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('token') || '',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete event')
      }
      dispatch(deleteEvent(eventId))
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error deleting event:', error)
    } finally{
      setIsDeleting(false)
    }
  }


  const handleEditSubmit = async () => {
    if (selectedEvent) {
      await handleEventChange({ 
        start: selectedEvent.start, 
        end: selectedEvent.end, 
        event: selectedEvent 
      });
    }
    setIsDialogOpen(false)
  }

  if (isFetching) { 
    return (
      <div className="w-screen h-screen flex flex justify-center items-center p-8 gap-4 space-y-3">
          <Skeleton className="h-full w-1/5 rounded-xl" />
          <Skeleton className="h-full w-4/5 rounded-xl" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-4 h-[90vh] w-full">
        <SidebarTrigger />
        <DnDCalendar
          defaultDate={moment().toDate()}
          defaultView="month"
          events={mappedEvents}
          localizer={myLocalizer}
          onEventDrop={handleEventChange}
          resizable
          onSelectEvent={handleSelectEvent}
          style={{ height: '80vh' }}
        />

        {/* Dialog for Editing Event */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button style={{ display: 'none' }}>Open Dialog</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Modify the event details below and save changes, or delete the event.
            </DialogDescription>

            {/* Event Title */}
            <Input
              className="mb-2"  
              placeholder="Event Title"
              value={selectedEvent?.title || ''}
              onChange={(e) => setSelectedEvent(prev => prev ? { ...prev, title: e.target.value } : null)}
            />
            
            {/* Event Description */}
            <Textarea
              className="mb-4"
              placeholder="Event Description"
              value={selectedEvent?.description || ''}
              onChange={(e) => setSelectedEvent(prev => prev ? { ...prev, description: e.target.value } : null)}
            />

            {/* Event Start Date */}
            <Input
              type="date"
              className="mb-4"
              value={selectedEvent?.start?.toISOString().substring(0, 10) || ''}
              onChange={(e) => setSelectedEvent(prev => prev ? { ...prev, start: new Date(e.target.value) } : null)}
            />

            {/* Event End Date */}
            <Input
              type="date"
              className="mb-4"
              value={selectedEvent?.end?.toISOString().substring(0, 10) || ''}
              onChange={(e) => setSelectedEvent(prev => prev ? { ...prev, end: new Date(e.target.value) } : null)}
            />


            <div className="flex justify-end space-x-2">
              {/* Save Changes */}
              {isSaving ? (
                <Button className="font-bold" disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </Button>
                ) : (
                <Button
                  onClick={handleEditSubmit}
                  className="bg-blue-500 text-white"
                >
                  Save
                </Button>
              )}

              {/* Delete Event */}
              {isDeleting ? (
                <Button className="font-bold" disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </Button>
                ) : (
                <Button
                  onClick={() => handleDeleteEvent(selectedEvent?.id as string)}
                  className="bg-red-500 text-white"
                  >
                    Delete
                </Button>
              )}

              {/* Close Dialog */}
              <DialogClose asChild>
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-gray-300"
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </SidebarProvider>
  )
}

export default EventPage