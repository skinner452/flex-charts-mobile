import { Exercise } from "@/types/exercises";
import { createSlice } from "@reduxjs/toolkit";

export const exercisesSlice = createSlice({
  name: "exercises",
  initialState: [] as Exercise[],
  reducers: {
    setExercises: (_state, action) => {
      return action.payload;
    },
    addExercise: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { addExercise, setExercises } = exercisesSlice.actions;
export default exercisesSlice.reducer;
