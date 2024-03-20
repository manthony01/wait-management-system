import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { Restaurant } from "../types";

type RestaurantState = {
  focused: Restaurant | null;
};

export const restaurantSlice = createSlice({
  name: "restasurant",
  initialState: () => {
    return { focused: null } as RestaurantState;
  },
  reducers: {
    setFocusedRestaurant: (
      state,
      {
        payload: { focused },
      }: PayloadAction<{
        focused: Restaurant | null;
      }>
    ) => {
      state.focused = focused;
    },
  },
});

export const { setFocusedRestaurant } = restaurantSlice.actions;

export default restaurantSlice.reducer;

export const selectCurrentRestaurant = (state: RootState) =>
  state.restaurant.focused;
