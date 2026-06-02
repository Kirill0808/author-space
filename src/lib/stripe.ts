import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export function getStripe() {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY?.trim()
    if (!key) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable")
    }
    stripeInstance = new Stripe(key, {
      apiVersion: "2026-05-27.dahlia",
      typescript: true,
    })
  }
  return stripeInstance
}
