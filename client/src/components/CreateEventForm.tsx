import React from "react"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { FaPlus } from "react-icons/fa6"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from "uuid"
import { useDispatch, useSelector } from "react-redux"
import { setEvents } from "@/store/eventsSlice"

interface Event {
  id: string
  start: Date
  end: Date
  title: string
  description: string
}

const CreateEventForm: React.FC = () => {
  const dispatch = useDispatch()
  const events = useSelector((state: { events: { events: Event[] } }) => state.events.events)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [eventInfo, setEventInfo] = useState<Omit<Event, "id">>({
    title: "",
    description: "",
    start: date || new Date(),
    end: date || new Date(), 
  })

  const handleCreateEvent = () => {

    if (!eventInfo.title.trim() || !eventInfo.end || !eventInfo.start) {
      alert("Please fill in all required fields.")
      return
    }

    const newEvent: Event = {
      id: uuidv4(),
      start: eventInfo.start,
      end: new Date(eventInfo.end), 
      title: eventInfo.title,
      description: eventInfo.description,
    }

    // Dispatch the updated events array
    dispatch(setEvents([...events, newEvent]))

    console.log("Event Created:", newEvent)

    // Reset the event info after creating the event
    setEventInfo({
      title: "",
      description: "",
      start: date || new Date(),
      end: date || new Date(),
    })
    setIsDialogOpen(false)
  }

  return (
    <div className="p-2 my-2 space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button
            className="bg-zinc-600 w-2/4 py-4 rounded-xl text-md font-bold flex items-center justify-around hover:bg-zinc-700"
            onClick={() => setIsDialogOpen(true)}
          >
            <FaPlus /> Create
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Fill in the details of the event below.
          </DialogDescription>

          {/* Event Title Input */}
          <Input
            className="mb-2"
            placeholder="Event Title"
            value={eventInfo.title}
            onChange={(e) =>
              setEventInfo((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          {/* Event Description Input */}
          <Textarea
            className="mb-4"
            placeholder="Event Description"
            value={eventInfo.description}
            onChange={(e) =>
              setEventInfo((prev) => ({ ...prev, description: e.target.value }))
            }
          />

          {/* Event Start Date */}
          <Input
            type="date"
            className="mb-4"
            value={eventInfo.start?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setEventInfo((prev) => ({
                ...prev,
                start: new Date(e.target.value),
              }))
            }
          />

          {/* Event End Date */}
          <Input
            type="date"
            className="mb-4"
            onChange={(e) =>
              setEventInfo((prev) => ({
                ...prev,
                end: new Date(e.target.value),
              }))
            }
          />

          <div className="flex justify-end space-x-2">
            <Button onClick={handleCreateEvent} className="bg-blue-500 text-white">
              Create Event
            </Button>
            <DialogClose asChild>
              <Button onClick={() => setIsDialogOpen(false)} className="bg-gray-300">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate} 
          className="rounded-md border cursor-pointer" 
        />
      </div>
    </div>
  )
}

export default CreateEventForm
