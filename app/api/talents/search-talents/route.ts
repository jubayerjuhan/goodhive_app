import postgres from "postgres";

export async function GET(request: Request) {
  {
    const sql = postgres(process.env.DATABASE_URL || "", {
      ssl: {
        rejectUnauthorized: false, // This allows connecting to a database with a self-signed certificate
      },
    });
    // Fetch data from the database or any external API
    // Return the fetched data as a response
    try {
      const data = await sql`SELECT * FROM goodhive.users`;
      return new Response(JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching data:", error);
      return new Response(JSON.stringify({ message: "Error fetching data" }), {
        status: 500,
      });
    }
  }
}
