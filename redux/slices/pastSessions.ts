import { Session } from "@/types/sessions";
import { createSlice } from "@reduxjs/toolkit";

export const pastSessionsSlice = createSlice({
  name: "pastSessions",
  initialState: [] as Session[],
  reducers: {
    setPastSessions: (_state, action) => {
      return action.payload;
    },
    addPastSession: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { addPastSession, setPastSessions } = pastSessionsSlice.actions;
export default pastSessionsSlice.reducer;
