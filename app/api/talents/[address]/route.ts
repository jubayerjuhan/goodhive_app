import { NextRequest } from "next/server";
import postgres from "postgres";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: any) {
  const { address: walletAddress } = context.params;

  const sql = postgres(process.env.DATABASE_URL || "", {
    ssl: {
      rejectUnauthorized: false, // This allows connecting to a database with a self-signed certificate
    },
  });

  if (!walletAddress) {
    return new Response(
      JSON.stringify({ message: "Missing address parameter" }),
      {
        status: 404,
      },
    );
  }

  try {
    const user = await sql`
        SELECT *
        FROM goodhive.users
        WHERE wallet_address = ${walletAddress}
      `;

    if (user.length === 0) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user[0]));
  } catch (error) {
    console.error("Error retrieving data:", error);

    return new Response(JSON.stringify({ message: "Error retrieving data" }), {
      status: 500,
    });
  }
}
