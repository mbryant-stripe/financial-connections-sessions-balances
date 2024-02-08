import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const account_ids = searchParams.get("account_ids")?.split(",");
  if (!account_ids) {
    return NextResponse.json(new Error("No account_ids provided"));
  }

  // Kick off a refresh for each account. They're asynchronous anyways, so don't bother blocking
  // on the result.
  account_ids.forEach((account_id) => {
    stripe.financialConnections.accounts.refresh(account_id, {
      features: ["balance"],
    });
    console.log(`Refresh initiated for account: ${account_id}`);
  });

  return NextResponse.json({});
}
