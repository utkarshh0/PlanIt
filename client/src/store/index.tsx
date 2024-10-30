import { configureStore } from '@reduxjs/toolkit'
import eventsReducer from './eventsSlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store