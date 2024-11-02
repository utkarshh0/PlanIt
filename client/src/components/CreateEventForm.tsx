import React, { useState } from "react"
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
import { useDispatch, useSelector } from "react-redux"
import { EventsState, setEvents } from "@/store/eventsSlice"
import { UserState } from "@/store/userSlice"
import { ReloadIcon } from "@radix-ui/react-icons"

interface Event {
  id: string | undefined
  startDate: Date
  endDate: Date
  title: string
  description: string
}

interface uState {
  user: UserState
}

interface eState {
  events: EventsState
}

const CreateEventForm: React.FC = () => {
  const dispatch = useDispatch()
  const events = useSelector((state: eState) => state.events.events)
  const user = useSelector((state: uState) => state.user?.user)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [eventInfo, setEventInfo] = useState<Omit<Event, "id">>({
    title: "",
    description: "",
    startDate: date || new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  })
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleCreateEvent = async () => {
    setErrorMessage(null) // Reset error message

    // Validate input fields
    if (!eventInfo.title.trim() || !eventInfo.endDate || !eventInfo.startDate) {
      setErrorMessage("Please fill in all required fields.")
      return
    }

    if (eventInfo.endDate <= eventInfo.startDate) {
      setErrorMessage("End date must be after the start date.")
      return
    }

    const newEvent: Event = {
      startDate: eventInfo.startDate,
      endDate: eventInfo.endDate,
      title: eventInfo.title,
      description: eventInfo.description,
      id: user?.id
    }

    try {
      setLoading(true)
      const response = await fetch("https://planit-amv2.onrender.com/api/event/", {
        method: "POST",
        headers: {
          'Authorization': localStorage.getItem('token') || '',
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      })

      if (!response.ok) {
        throw new Error("Failed to add event")
      }

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
      setErrorMessage("Failed to add event. Please try again.")
    } finally {
      setLoading(false)
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

          {errorMessage && (
            <div className="mb-2 text-red-600">{errorMessage}</div>
          )}

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
            {loading ? (
              <Button className="font-bold" disabled>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </Button>
            ) : (
              <Button onClick={handleCreateEvent} className="bg-blue-500 text-white">
                Create Event
              </Button>
            )}
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
