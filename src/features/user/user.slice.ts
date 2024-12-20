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
  loading: boolean
}

const initialState: InitialState = {
  user: null,
  isAuthenticated: false,
  users: null,
  current: null,
  loading: true,
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => initialState,
    resetUser: state => {
      state.user = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
        state.token = action.payload.token
        state.isAuthenticated = true
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
          state.loading = false
        },
      )
  },
})

export const { logout, resetUser, setLoading } = slice.actions
export default slice.reducer

// Селекторы для получения данных из стейта
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated

export const selectCurrent = (state: RootState) => state.auth.current

export const selectUsers = (state: RootState) => state.auth.users

export const selectUser = (state: RootState) => state.auth.user
