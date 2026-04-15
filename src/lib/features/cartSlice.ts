import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlateItem {
  id: string;
  plateNumber: string;
  roadLegalSpacing: boolean;
  front?: any;
  rear?: any;
  frontPrice: number;
  rearPrice: number;
  quantity: number;
}

interface CartState {
  items: PlateItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<PlateItem>) => {
      const existing = state.items.find(i => i.id === action.payload.id);

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },

    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;