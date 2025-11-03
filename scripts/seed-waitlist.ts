/*
  One-time script to seed the Firestore waitlist collection.
  Run: npx ts-node scripts/seed-waitlist.ts
*/

import { db } from "../lib/firebase"
import { seedWaitlist } from "../lib/waitlist-seed"

async function main() {
  try {
    console.log("Seeding waitlist...")
    await seedWaitlist(db)
    console.log("Done.")
    process.exit(0)
  } catch (err) {
    console.error("Seeding failed:", err)
    process.exit(1)
  }
}

main()


