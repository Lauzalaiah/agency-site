import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, instagram, country, email, token } = body

    if (!name || !instagram || !country || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY

    if (!supabaseUrl || !supabaseKey || !turnstileSecret) {
      console.error("Missing ENV")
      return NextResponse.json({ error: "Server config error" }, { status: 500 })
    }

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${turnstileSecret}&response=${token}`,
      }
    )

    const verifyData = await verifyRes.json()

    if (!verifyData.success) {
      return NextResponse.json({ error: "Captcha failed" }, { status: 400 })
    }

    const { createClient } = await import("@supabase/supabase-js")

    const supabase = createClient(supabaseUrl, supabaseKey)

    await supabase.from("leads").insert([
      { name, instagram, email, country },
    ])

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
