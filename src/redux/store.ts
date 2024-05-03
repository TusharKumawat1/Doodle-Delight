import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./user/userSlice"
import roomreducer from "./room/roomSlice"
import utilityReducer from "./utils/utilitySlice"
export const store = configureStore({
  reducer: {
    user:userReducer,
    room:roomreducer,
    utility:utilityReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch