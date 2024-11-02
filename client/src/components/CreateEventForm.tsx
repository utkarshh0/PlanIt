import React, { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
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
import { UserState } from "@/store/userSlice"

interface Event {
  id: string
  startDate: Date
  endDate: Date
  title: string
  description: string
}

interface uState{
  user : UserState
}

const CreateEventForm: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: uState) => state.user?.user)
  console.log(user)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [eventInfo, setEventInfo] = useState<Omit<Event, "id">>({
    title: "",
    description: "",
    startDate: date || new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Default end date as next day
  })

  const handleCreateEvent = async () => {
    if (!eventInfo.title.trim() || !eventInfo.endDate || !eventInfo.startDate) {
      alert("Please fill in all required fields.")
      return
    }

    const newEvent: Event = {
      startDate: eventInfo.startDate,
      endDate: eventInfo.endDate,
      title: eventInfo.title,
      description: eventInfo.description,
      userId : user.id
    }

    try {
      // Send POST request to server using fetch
      const response = await fetch("http://localhost:5000/api/event/", {
        method: "POST",
        headers: {
          'Authorization': localStorage.getItem('token') || '',
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      })

      console.log(response)
      if (!response.ok) {
        throw new Error("Failed to add event")
      }

      console.log("Event added to server:", newEvent)

      // Dispatch to Redux store
      dispatch(setEvents([...events, newEvent]))

      // Reset form
      setEventInfo({
        title: "",
        description: "",
        startDate: date || new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error adding event:", error)
      alert("Failed to add event. Please try again.")
    }
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
            required
          />

          {/* Event Description Input */}
          <Textarea
            className="mb-4"
            placeholder="Event Description"
            value={eventInfo.description}
            onChange={(e) =>
              setEventInfo((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />

          {/* Event Start Date */}
          <Input
            type="date"
            className="mb-4"
            value={eventInfo.startDate?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setEventInfo((prev) => ({
                ...prev,
                startDate: new Date(e.target.value),
              }))
            }
            required
          />

          {/* Event End Date */}
          <Input
            type="date"
            className="mb-4"
            value={eventInfo.endDate?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setEventInfo((prev) => ({
                ...prev,
                endDate: new Date(e.target.value),
              }))
            }
            required
          />

          <div className="flex justify-end space-x-2">
            <Button onClick={() => console.log('fsd')} className="bg-blue-500 text-white">
              Create Event
            </Button>+
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
