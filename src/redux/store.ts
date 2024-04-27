import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./user/userSlice"
import roomreducer from "./room/roomSlice"
export const store = configureStore({
  reducer: {
    user:userReducer,
    room:roomreducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch