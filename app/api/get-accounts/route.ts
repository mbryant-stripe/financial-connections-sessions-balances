import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const account_ids = searchParams.get("account_ids")?.split(",");
  if (!account_ids) {
    return NextResponse.json(new Error("No account_ids provided"));
  }

  const promises = account_ids.map((account_id) => {
    return stripe.financialConnections.accounts.retrieve(account_id);
  });
  const accounts = await Promise.all(promises);

  return NextResponse.json({ accounts });
}
