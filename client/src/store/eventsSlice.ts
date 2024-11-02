import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface Event {
  id: string | undefined
  startDate: Date
  endDate: Date
  title: string
  description: string
}

// const octoberEvents: Event[] = [
//     {
//       id: "1",  // Changed to string
//       start: new Date(2024, 9, 5, 10, 0), // Oct 5, 2024, 10:00 AM
//       end: new Date(2024, 9, 5, 12, 0),   // Oct 5, 2024, 12:00 PM
//       title: "Project Kick-off Meeting",
//       description: "Initial meeting to discuss project scope and timelines."
//     },
//     {
//       id: "2",  // Changed to string
//       start: new Date(2024, 9, 12, 14, 30), // Oct 12, 2024, 2:30 PM
//       end: new Date(2024, 9, 12, 16, 0),   // Oct 12, 2024, 4:00 PM
//       title: "Team Building Activity",
//       description: "Outdoor activities to strengthen team collaboration."
//     },
//     {
//       id: "3",  // Changed to string
//       start: new Date(2024, 9, 20, 9, 0), // Oct 20, 2024, 9:00 AM
//       end: new Date(2024, 9, 20, 11, 0),   // Oct 20, 2024, 11:00 AM
//       title: "Monthly Performance Review",
//       description: "Reviewing individual and team performance metrics."
//     },
//     {
//       id: "4",  // Changed to string
//       start: new Date(2024, 9, 28, 13, 0), // Oct 28, 2024, 1:00 PM
//       end: new Date(2024, 9, 28, 15, 0),   // Oct 28, 2024, 3:00 PM
//       title: "Client Feedback Session",
//       description: "Meeting with clients to gather feedback on recent projects."
//     },
// ]
  
// const novemberEvents: Event[] = [
//     {
//       id: "5",  // Changed to string
//       start: new Date(2024, 10, 2, 11, 0), // Nov 2, 2024, 11:00 AM
//       end: new Date(2024, 10, 2, 13, 0),   // Nov 2, 2024, 1:00 PM
//       title: "Design Review Meeting",
//       description: "Reviewing the design prototypes with stakeholders."
//     },
//     {
//       id: "6",  // Changed to string
//       start: new Date(2024, 10, 9, 15, 0), // Nov 9, 2024, 3:00 PM
//       end: new Date(2024, 10, 9, 17, 0),   // Nov 9, 2024, 5:00 PM
//       title: "Sprint Planning Session",
//       description: "Planning the upcoming sprint tasks and objectives."
//     },
//     {
//       id: "7",  // Changed to string
//       start: new Date(2024, 10, 15, 9, 0), // Nov 15, 2024, 9:00 AM
//       end: new Date(2024, 10, 15, 10, 30), // Nov 15, 2024, 10:30 AM
//       title: "Health and Wellness Workshop",
//       description: "Workshop focusing on mental and physical well-being."
//     },
//     {
//       id: "8",  // Changed to string
//       start: new Date(2024, 10, 23, 14, 0), // Nov 23, 2024, 2:00 PM
//       end: new Date(2024, 10, 23, 16, 0),   // Nov 23, 2024, 4:00 PM
//       title: "Quarterly Business Review",
//       description: "Reviewing business performance and setting new goals."
//     },
// ]
  
export interface EventsState {
  events: Event[]
}

const initialState: EventsState = {
  events: [],
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<Event[]>) {
      state.events = action.payload
    },
    updateEvent(state, action: PayloadAction<Event>) {
      const index = state.events.findIndex(event => event.id === action.payload.id)
      if (index !== -1) {
        state.events[index] = action.payload
      }
    },
    deleteEvent(state, action: PayloadAction<string>) { // Changed from number to string
      state.events = state.events.filter(event => event.id !== action.payload)
    },
  },
})

export const { setEvents, updateEvent, deleteEvent } = eventsSlice.actions
export default eventsSlice.reducer
