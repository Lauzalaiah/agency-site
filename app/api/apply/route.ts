import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, instagram, country, email, website, token } = body

    // 🛡️ 1. Honeypot (anti-bot invisible)
    if (website) {
      return NextResponse.json({ error: "Bot detected" }, { status: 400 })
    }

    // 🛡️ 2. Vérification Turnstile (Cloudflare)
    if (!token) {
      return NextResponse.json({ error: "Captcha missing" }, { status: 400 })
    }

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`,
      }
    )

    const verifyData = await verifyRes.json()

    if (!verifyData.success) {
      return NextResponse.json({ error: "Captcha failed" }, { status: 400 })
    }

    // 🛡️ 3. Validation des champs
    if (!name || !instagram || !country || !email) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      )
    }

    if (instagram.length < 3) {
      return NextResponse.json(
        { error: "Invalid Instagram" },
        { status: 400 }
      )
    }

    // 🔥 4. Format message Telegram (clean)
    const message = `
🔥 NEW LEAD

👤 Name: ${name}
📸 Instagram: ${instagram}
🌍 Country: ${country}
📧 Email: ${email}
    `

    // 🚀 5. Envoi Telegram
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
        }),
      }
    )

    if (!res.ok) {
      throw new Error("Telegram failed")
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("API ERROR:", error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
