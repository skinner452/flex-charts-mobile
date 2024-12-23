import { Session } from "@/types/sessions";
import { createSlice } from "@reduxjs/toolkit";

export const activeSessionSlice = createSlice({
  name: "activeSession",
  initialState: null as Session | null,
  reducers: {
    setActiveSession: (_state, action) => {
      return action.payload;
    },
    clearActiveSession: () => {
      return null;
    },
  },
});

export const { clearActiveSession, setActiveSession } =
  activeSessionSlice.actions;
export default activeSessionSlice.reducer;
