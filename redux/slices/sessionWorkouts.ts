import { Workout } from "@/types/workouts";
import { createSlice } from "@reduxjs/toolkit";

export const sessionWorkoutsSlice = createSlice({
  name: "sessionWorkouts",
  initialState: [] as Workout[],
  reducers: {
    setSessionWorkouts: (_state, action) => {
      return action.payload;
    },
    addSessionWorkout: (state, action) => {
      state.push(action.payload);
    },
    deleteSessionWorkout: (state, action) => {
      return state.filter((workout) => workout.id !== action.payload);
    },
  },
});

export const { addSessionWorkout, deleteSessionWorkout, setSessionWorkouts } =
  sessionWorkoutsSlice.actions;
export default sessionWorkoutsSlice.reducer;
