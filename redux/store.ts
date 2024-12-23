import { configureStore } from "@reduxjs/toolkit";
import { exercisesSlice } from "./slices/exercises";
import { sessionWorkoutsSlice } from "./slices/sessionWorkouts";
import { activeSessionSlice } from "./slices/activeSession";

export const store = configureStore({
  reducer: {
    exercises: exercisesSlice.reducer,
    sessionWorkouts: sessionWorkoutsSlice.reducer,
    activeSession: activeSessionSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
