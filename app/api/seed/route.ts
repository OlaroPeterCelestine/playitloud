import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { seedWaitlist, WAITLIST_SEED } from "@/lib/waitlist-seed"

export async function POST() {
  try {
    await seedWaitlist(db)
    return NextResponse.json({ ok: true, added: WAITLIST_SEED.length })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}


