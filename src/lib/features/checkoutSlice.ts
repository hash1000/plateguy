import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CheckoutStep = "details" | "address";

export type CheckoutContact = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export type CheckoutAddress = {
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
};

export type CheckoutState = {
  step: CheckoutStep;
  contact: CheckoutContact;
  address: CheckoutAddress;
};

const initialState: CheckoutState = {
  step: "details",
  contact: {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  },
  address: {
    line1: "",
    line2: "",
    city: "",
    county: "",
    postcode: "",
  },
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<CheckoutStep>) => {
      state.step = action.payload;
    },
    setContact: (state, action: PayloadAction<Partial<CheckoutContact>>) => {
      state.contact = { ...state.contact, ...action.payload };
    },
    setAddress: (state, action: PayloadAction<Partial<CheckoutAddress>>) => {
      state.address = { ...state.address, ...action.payload };
    },
    resetCheckout: () => initialState,
  },
});

export const { setStep, setContact, setAddress, resetCheckout } =
  checkoutSlice.actions;

export default checkoutSlice.reducer;

