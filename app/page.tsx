"use client";

import { useState } from "react";
import React, { FormEvent } from "react";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const pollForBalances = async (accountIds: string[]) => {
  // In real apps this should timeout.
  while (true) {
    const resp = await fetch(
      `/api/get-accounts?account_ids=${accountIds.join(",")}`
    );
    const json = await resp.json();
    const accounts = json.accounts;
    console.log(accounts);
    if (
      // In real apps this would check if the balance refresh failed.
      accounts.every((account: any) => account.balance_refresh !== undefined)
    ) {
      return accounts.map((account: any) => {
        // This uses the available cash balance, but balances are more complicated than this.
        // See https://stripe.com/docs/financial-connections/balances#balance-data-details for more details.
        return {
          accountId: account.id,
          balance: account.balance?.cash?.available?.usd,
        };
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

const formatAmount = (amount: number): string => {
  // Balances are in cents, this just formats nicely to USD with decimals.
  return `$${(amount / 100).toFixed(2)}`;
};

const Balance = ({
  balance,
  accountId,
}: {
  balance: number;
  accountId: string;
}) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <span>{accountId}: </span>
      <span className="font-bold">{formatAmount(balance)}</span>
    </div>
  );
};

type AccountWithBalance = {
  accountId: string;
  balance: number;
};

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [usePrefetch, setUsePrefetch] = useState(false);
  const [accountsWithBalance, setAccountsWithBalance] = useState<
    AccountWithBalance[]
  >([]);

  const handleClick = async (e: FormEvent) => {
    setAccountsWithBalance([]);
    setLoading(true);

    // Create Session on server
    const resp = await fetch("/api/link_account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usePrefetch }),
    });
    const json = await resp.json();
    const clientSecret = json.clientSecret;

    // Launch Financial Connections modal
    const stripe = await stripePromise;
    const result = await stripe?.collectFinancialConnectionsAccounts({
      clientSecret,
    });

    if (result?.financialConnectionsSession !== undefined) {
      const accountIds = result.financialConnectionsSession.accounts.map(
        (account) => account.id
      );
      if (usePrefetch) {
        // If we're using prefetch, the balance refresh has already been initiated and all we have to do is wait for it to complete.
        const results = await pollForBalances(accountIds);
        setAccountsWithBalance(results);
      } else {
        // If we're not using prefetch, we have to initiate a refresh on the server, and then we can wait for them to complete
        await fetch("/api/initiate-refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ account_ids: accountIds }),
        });
        const results = await pollForBalances(accountIds);
        setAccountsWithBalance(results);
      }
    } else {
      // This is where error handling would go in a real app. This covers both if the session errors
      // or if the user closes the modal without linking an account.
      console.log("No accounts found");
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-6 py-2 bg-green text-white font-bold rounded-3xl hover:bg-highlight"
      >
        {loading ? (
          <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
        ) : (
          <>Link your bank account</>
        )}
      </button>
      <div className="m-8 flex items-center">
        <input
          type="checkbox"
          id="usePrefetch"
          name="usePrefetch"
          checked={usePrefetch}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setUsePrefetch(event.target.checked);
          }}
          className="h-4 w-4 text-highlight rounded"
        />
        <label htmlFor="usePrefetch" className="ml-2 text-sm text-highlight">
          Use Prefetch
        </label>
      </div>
      {accountsWithBalance.length > 0 && (
        <div className="m-8">
          <h2 className="text-xl font-bold">Balances</h2>
          <ul>
            {accountsWithBalance.map((accountWithBalance, index) => (
              <li key={index}>
                <Balance
                  accountId={accountWithBalance.accountId}
                  balance={accountWithBalance.balance}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Home;
