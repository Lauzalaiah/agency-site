import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, instagram, country, email, token } = body

    // ✅ validation basique
    if (!name || !instagram || !country || !email) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    // ⚠️ IMPORTANT : on ne lit PAS les env en haut du fichier
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY

    // ✅ sécurité : ne crash pas le build
    if (!supabaseUrl || !supabaseKey || !turnstileSecret) {
      console.error("Missing ENV variables")

      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 }
      )
    }

    // 🔐 vérification captcha
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${turnstileSecret}&response=${token}`,
      }
    )

    const verifyData = await verifyRes.json()

    if (!verifyData.success) {
      return NextResponse.json(
        { error: "Captcha failed" },
        { status: 400 }
      )
    }

    // 🔥 import dynamique = évite crash build
    const { createClient } = await import("@supabase/supabase-js")

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 💾 insert
    const { error } = await supabase.from("leads").insert([
      {
        name,
        instagram,
        email,
        country,
      },
    ])

    if (error) {
      console.error(error)
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })

  } catch (err) {
    console.error("API ERROR:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
