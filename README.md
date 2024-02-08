## Financial Connections standalone demo

This is a demo of [Stripe Financial Connections](https://stripe.com/docs/financial-connections). It uses our [Sessions API](https://stripe.com/docs/api/financial_connections/sessions) to collect bank accounts and retrieves [balances](https://stripe.com/docs/financial-connections/balances) on these accounts.

It demonstrates the two ways to retrieve balance data on a linked account: [prefetch](https://stripe.com/docs/financial-connections/balances#prefetch-balance-data) and [on-demand refreshes](https://stripe.com/docs/financial-connections/balances#initiate-an-on-demand-refresh).

## Getting started

All you should need to get running is `npm` and some Stripe API keys. This was tested locally with `npm` version `9.3.1`.

**Keep in mind if you use live mode Stripe API keys, you will be charged for the Financial Connections verifications!**

After you clone or unzip the repository locally, first create an `.env.local` file with your Stripe API keys in the following format, substituting your API keys.

```bash
#!/bin/bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Next, run `npm install` and `npm run dev`. Visit `localhost:3000` (or whatever port it tells you to visit) to check it out!
