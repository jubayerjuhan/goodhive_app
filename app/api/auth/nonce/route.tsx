"use server";

import { cookies } from "next/headers";

import { generateNonce } from "siwe";

const ALLOWED_METHODS = ["GET"];

export async function GET(request: Request) {
  const { method } = request;
  const cookieStore = await cookies();

  if (!ALLOWED_METHODS.includes(method)) {
    return new Response(null, {
      status: 405,
      statusText: "Method Not Allowed",
    });
  }

  const nonce = await generateNonce();

  // Reset the address cookie
  // Disable the linting rule for the following line
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  cookieStore.set("address", "", {
    path: "/",
  });

  // Disable the linting rule for the following line
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  cookieStore.set("nonce", nonce, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  // TODO: Add nonce to database in the user table (auth_nonce column)

  return new Response(nonce);
}
