import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("Stripe-Signature")

  if (!signature) {
    return new NextResponse("Missing Stripe-Signature header", { status: 400 })
  }

  let event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any
      const orderId = session.metadata?.orderId

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        })
        console.log(`Order ${orderId} successfully marked as PAID via Webhook.`)
      } else {
        console.warn("No orderId found in session metadata.")
      }
    }

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 })
  } catch (error: any) {
    console.error(`Error processing webhook event: ${error.message}`)
    return new NextResponse(`Internal Error: ${error.message}`, { status: 500 })
  }
}
