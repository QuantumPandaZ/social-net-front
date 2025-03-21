import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../app/types'
import { userApi } from '../../app/services/user.api'
import { RootState } from '../../app/store'

interface InitialState {
  user: User | null
  isAuthenticated: boolean
  users: User[] | null
  current: User | null
  token?: string
}

const initialState: InitialState = {
  user: null,
  isAuthenticated: false,
  users: null,
  current: null,
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => {
      localStorage.removeItem('token')
      return initialState
    },
    resetUser: state => {
      state.user = null
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
        state.token = action.payload.token
        state.isAuthenticated = true
        localStorage.setItem('token', action.payload.token)
      })
      .addMatcher(
        userApi.endpoints.currentUser.matchFulfilled,
        (state, action) => {
          state.isAuthenticated = true
          state.current = action.payload
        },
      )
      .addMatcher(
        userApi.endpoints.getUserById.matchFulfilled,
        (state, action) => {
          state.user = action.payload
        },
      )
  },
})

export const { logout, resetUser } = slice.actions
export default slice.reducer

// Селекторы для получения данных из стейта
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated

export const selectCurrent = (state: RootState) => state.auth.current

export const selectUsers = (state: RootState) => state.auth.users

export const selectUser = (state: RootState) => state.auth.user
