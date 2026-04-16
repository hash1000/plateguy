import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

export const stripe =
  stripeSecretKey && stripeSecretKey.length > 0
    ? new Stripe(stripeSecretKey)
    : null;
