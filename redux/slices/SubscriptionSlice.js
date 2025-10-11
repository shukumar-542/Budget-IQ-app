import { createSlice } from "@reduxjs/toolkit";
import {
  getSubscriptionViewTime,
  saveSubscriptionViewTime,
} from "../../utils/secureStore";

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: { lastViewTime: null },
  reducers: {
    setLastViewTime: (state, action) => {
      state.lastViewTime = action.payload;
    },
  },
});

export const { setLastViewTime } = subscriptionSlice.actions;

// Load last view time from SecureStore
export const loadLastViewTime = () => async (dispatch) => {
  try {
    const time = await getSubscriptionViewTime();
    dispatch(setLastViewTime(time));
  } catch (error) {
    
  }
};

// Save current time to SecureStore AND Redux
export const saveCurrentViewTime = () => async (dispatch) => {
  try {
    const now = new Date().getTime();
    await saveSubscriptionViewTime(); // save current timestamp
    dispatch(setLastViewTime(now)); // update Redux state
  } catch (error) {
  
  }
};

export default subscriptionSlice.reducer;
