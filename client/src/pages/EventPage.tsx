// src/pages/EventPage.tsx
import { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import "react-big-calendar/lib/css/react-big-calendar.css"
import moment from 'moment'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog"
import { useDispatch, useSelector } from 'react-redux'
import { updateEvent, deleteEvent, Event } from '../store/eventsSlice'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { EventsState } from '../store/eventsSlice'

const DnDCalendar = withDragAndDrop(Calendar)
const myLocalizer = momentLocalizer(moment)

interface eState {
  events : EventsState
}

const EventPage: React.FC = () => {
  const dispatch = useDispatch()
  const events = useSelector((state: eState) => state.events.events)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // useEffect(() => {
  //   // Load initial events (you may fetch these from an API)
  //   const initialEvents = [
  //     { id: 1, start: moment().toDate(), end: moment().add(1, "days").toDate(), title: "Annual Company Meeting", description: "Review of company's performance." },
  //     { id: 2, start: moment().add(2, "days").toDate(), end: moment().add(3, "days").toDate(), title: "Team Building Workshop", description: "Enhance teamwork." },
  //     // More events...
  //   ]
  //   dispatch(setEvents(initialEvents))
  // }, [dispatch])

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event)
    setIsDialogOpen(true)
  }

  const handleEventChange = ({ start, end, event } : any) => {
    const updatedEvent = { ...event, start, end }
    dispatch(updateEvent(updatedEvent))
  }

  const handleDeleteEvent = (eventId: string) => {
    dispatch(deleteEvent(eventId))
    setIsDialogOpen(false)
  }

  const handleEditSubmit = () => {
    if (selectedEvent) {
      dispatch(updateEvent(selectedEvent))
    }
    setIsDialogOpen(false)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-4 h-[90vh] w-full">
        <SidebarTrigger />
        <DnDCalendar
          defaultDate={moment().toDate()}
          defaultView="month"
          events={events}
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

            <div className="flex justify-end space-x-2">
              {/* Save Changes */}
              <Button
                onClick={handleEditSubmit}
                className="bg-blue-500 text-white"
              >
                Save
              </Button>

              {/* Delete Event */}
              <Button
                onClick={() => handleDeleteEvent(selectedEvent?.id as string)}
                className="bg-red-500 text-white"
              >
                Delete
              </Button>

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
