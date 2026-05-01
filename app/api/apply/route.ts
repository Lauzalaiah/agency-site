import { NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rateMap = new Map<string, { count: number; time: number }>()

const disposableDomains = [
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "yopmail.com",
  "guerrillamail.com",
]

function scoreLead({ email, instagram, country }: any) {
  let score = 0

  if (!email.includes("gmail")) score += 2
  if (instagram.length > 5) score += 1
  if (["France", "USA", "UK", "Canada"].includes(country)) score += 2

  return score
}

function getQuality(score: number) {
  if (score >= 4) return "🔥 HIGH"
  if (score >= 2) return "⚡ MEDIUM"
  return "❄️ LOW"
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown"

    const body = await req.json()
    const { name, instagram, country, email, website, token } = body

    // 🛡️ Honeypot
    if (website) {
      return NextResponse.json({ error: "Bot detected" }, { status: 400 })
    }

    // 🛡️ Rate limit
    const now = Date.now()
    const windowMs = 60000
    const max = 5

    const user = rateMap.get(ip) || { count: 0, time: now }

    if (now - user.time > windowMs) {
      user.count = 0
      user.time = now
    }

    user.count++
    rateMap.set(ip, user)

    if (user.count > max) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      )
    }

    // 🛡️ CAPTCHA Turnstile
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

    // 🛡️ Validation
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

    const domain = email.split("@")[1]
    if (disposableDomains.includes(domain)) {
      return NextResponse.json(
        { error: "Disposable email not allowed" },
        { status: 400 }
      )
    }

    // 🧠 Scoring
    const score = scoreLead({ email, instagram, country })
    const quality = getQuality(score)

    // 🔥 Token unique
    const leadToken = crypto.randomUUID()

    // 💾 Insert Supabase avec check erreur
    const { data, error } = await supabase.from("leads").insert([
      {
        token: leadToken,
        name,
        instagram,
        email,
        country,
        score,
        quality,
        ip,
        source: "organic",
      },
    ])

    if (error) {
      console.error("SUPABASE ERROR:", error)
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      )
    }

    // 🤖 Telegram
    const telegramLink = `https://t.me/leofmelite_bot?start=lead_${leadToken}`

    const message = `
🚀 NEW LEAD ${quality}

👤 ${name}
📸 ${instagram}
🌍 ${country}
📧 ${email}

⭐ Score: ${score}/5
🔗 ${telegramLink}
`

    await fetch(
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

    return NextResponse.json({
      success: true,
      telegramLink,
    })
  } catch (err) {
    console.error("API ERROR:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
