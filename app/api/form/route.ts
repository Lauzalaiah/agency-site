import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const name = formData.get('name')?.toString() ?? ''
    const instagram = formData.get('instagram')?.toString() ?? ''
    const email = formData.get('email')?.toString() ?? ''

    const message = `
🚀 New Lead OFM

👤 Name: ${name}
📸 Instagram: ${instagram}
📧 Email: ${email}
`

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID

    // ✅ Sécurité
    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('ENV ERROR:', { BOT_TOKEN, CHAT_ID })
      return NextResponse.json(
        { success: false, error: 'Missing Telegram config' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      }
    )

    // ✅ Vérif Telegram
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Telegram API error:', errorText)

      return NextResponse.json(
        { success: false, error: 'Telegram failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API ERROR:', error)

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}