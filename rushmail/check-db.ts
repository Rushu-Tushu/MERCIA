import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

async function main() {
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
  console.log("Tables in database:");
  for (const row of result.rows) {
    console.log(`- ${row.name}`);
  }
}

main().catch(console.error);
