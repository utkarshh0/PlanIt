import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  name: string
  email: string
}

export interface UserState {
  user: User | null
}

const initialState: UserState = {
  user: {
    id: "123",
    name: "John Doe",
    email: "john@example.com",
  },
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
  },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer
