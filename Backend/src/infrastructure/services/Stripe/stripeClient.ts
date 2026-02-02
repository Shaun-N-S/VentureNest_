import { CONFIG } from "@config/config";
import Stripe from "stripe";

export const stripe = new Stripe(CONFIG.STRIPE_SECRET_KEY!);
