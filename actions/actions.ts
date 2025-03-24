"use server";

import { randomUUID } from "crypto";
import { Client, Environment } from "square";

// @ts-expect-error BigInt is not supported in TypeScript
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const { paymentsApi } = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});

export async function submitPayment(sourceId: string, amount: number) {
  try {
    const { result } = await paymentsApi.createPayment({
      idempotencyKey: randomUUID(),
      sourceId,
      amountMoney: {
        currency: "USD",
        amount: BigInt(amount),
      },
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}
