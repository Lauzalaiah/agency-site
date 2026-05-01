import { NextResponse } from "next/server"
import crypto from "crypto"

// 🧠 Rate limit mémoire
const rateMap = new Map<string, { count: number; time: number }>()

// 🧠 stockage temporaire des leads (⚠️ reset si server reboot)
const leadsStore: Record<string, any> =
  (globalThis as any).leadsStore ||
  ((globalThis as any).leadsStore = {})

// 🧠 domaines jetables
const disposableDomains = [
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "yopmail.com",
  "guerrillamail.com",
  "trashmail.com",
  "sharklasers.com",
]

// 🧠 scoring
function scoreLead({
  email,
  instagram,
  country,
}: {
  email: string
  instagram: string
  country: string
}) {
  let score = 0

  if (!email.includes("gmail") && !email.includes("yahoo")) score += 2
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

    // 🛡️ 1. Honeypot
    if (website) {
      return NextResponse.json({ error: "Bot detected" }, { status: 400 })
    }

    // 🛡️ 2. Rate limit
    const now = Date.now()
    const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000)
    const max = Number(process.env.RATE_LIMIT_MAX || 5)

    const user = rateMap.get(ip) || { count: 0, time: now }

    if (now - user.time > windowMs) {
      user.count = 0
      user.time = now
    }

    user.count += 1
    rateMap.set(ip, user)

    if (user.count > max) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      )
    }

    // 🛡️ 3. Turnstile
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
        body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}&remoteip=${ip}`,
      }
    )

    const verifyData = await verifyRes.json()

    if (!verifyData.success) {
      return NextResponse.json({ error: "Captcha failed" }, { status: 400 })
    }

    // 🛡️ 4. Validation
    if (!name || !instagram || !country || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // 🛡️ 5. Email jetable
    const domain = email.split("@")[1]?.toLowerCase()
    if (disposableDomains.includes(domain)) {
      return NextResponse.json(
        { error: "Disposable email not allowed" },
        { status: 400 }
      )
    }

    // 🧠 6. Scoring
    const score = scoreLead({ email, instagram, country })
    const quality = getQuality(score)

    // 🔐 7. Génération TOKEN unique
    const leadToken = crypto.randomUUID()

    // 🗄️ stockage temporaire
    leadsStore[leadToken] = {
      name,
      instagram,
      email,
      score,
      createdAt: Date.now(),
      used: false,
    }

    // 🔗 lien Telegram unique
    const telegramLink = `https://t.me/leofmelite_bot?start=lead_${leadToken}`

    // 📩 message Telegram enrichi
    const message = `
🚀 NEW LEAD ${quality}

👤 Name: ${name}
📸 Instagram: ${instagram}
🌍 Country: ${country}
📧 Email: ${email}

⭐ Score: ${score}/5
🌐 IP: ${ip}

👉 Contact: ${telegramLink}
`

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
