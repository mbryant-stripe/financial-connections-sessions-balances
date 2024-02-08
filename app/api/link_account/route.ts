import { NextResponse } from "next/server";

// Server-side Stripe SDK
import Stripe from "stripe";

// Initialize the server-side SDK
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function POST(request: Request) {
  const body = await request.json();
  const { usePrefetch } = body;

  const customer = await stripe.customers.create({
    name: "Jenny Rosen",
    email: "jenny.rosen@example.com",
  });

  // You must have a completed Financial Connections registration to access data like
  // balances in livemode. If this
  const session = await stripe.financialConnections.sessions.create({
    account_holder: { type: "customer", customer: customer.id },
    permissions: ["payment_method", "balances"],
    // @ts-ignore `prefetch` is a new feature and not in this version of the SDK
    ...(usePrefetch && { prefetch: ["balances"] }),
    filters: { countries: ["US"] },
  });

  console.log(`Created Financial Connections Session: ${session.id}`);

  return NextResponse.json({
    clientSecret: session.client_secret,
    customer: customer.id,
  });
}
