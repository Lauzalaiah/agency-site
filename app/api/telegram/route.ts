import { NextResponse } from "next/server"

export const runtime = "nodejs"

// ✅ stockage global safe (évite crash)
const processedMessages =
  (globalThis as any).__processedMessages ||
  ((globalThis as any).__processedMessages = {})

export async function POST(req: Request) {
  try {
    const update = await req.json()

    console.log("UPDATE:", JSON.stringify(update))

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN

    if (!TOKEN) {
      console.error("Missing TELEGRAM_BOT_TOKEN")
      return NextResponse.json({ ok: false })
    }

    // =========================
    // /start
    // =========================
    if (update.message?.text === "/start") {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: update.message.chat.id,
          text: "Bot ready 🚀",
        }),
      }).catch(console.error)
    }

    // =========================
    // CALLBACK BUTTONS
    // =========================
    if (update.callback_query) {
      const data = update.callback_query.data
      const chatId = update.callback_query.message.chat.id
      const callbackId = update.callback_query.id
      const messageId = update.callback_query.message.message_id

      // 🔒 anti double click
      if (processedMessages[messageId]) {
        return NextResponse.json({ ok: true })
      }

      processedMessages[messageId] = true

      const messageText = update.callback_query.message.text || ""

      const name = messageText.match(/Name: (.*)/)?.[1]
      const ig = messageText.match(/IG: (.*)/)?.[1]

      let text = ""
      let status = ""

      // =========================
      // ACTIONS
      // =========================
      if (data === "respond") {
        status = "Responded ✅"
        text = `Hey ${name || ""}! 👋\nTell me more about your goals`

        // 🔥 tracking (non bloquant)
        fetch("https://www.leofmelite.com/api/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            ig,
            status,
            action: data,
          }),
        }).catch(console.error)
      }

      if (data === "follow_up") {
        status = "Followed up ⏳"
        text = "Just checking — are you still interested?"
      }

      if (data === "ignore") {
        status = "Ignored ❌"
        text = "Lead ignored ❌"
      }

      // =========================
      // SEND MESSAGE
      // =========================
      if (text) {
        await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
          }),
        }).catch(console.error)
      }

      // =========================
      // UPDATE STATUS
      // =========================
      if (status) {
        const newText = `${messageText}\n\n📌 Status: ${status}`

        await fetch(`https://api.telegram.org/bot${TOKEN}/editMessageText`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            text: newText,
          }),
        }).catch(console.error)
      }

      // =========================
      // REMOVE BUTTONS
      // =========================
      await fetch(
        `https://api.telegram.org/bot${TOKEN}/editMessageReplyMarkup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: messageId,
            reply_markup: { inline_keyboard: [] },
          }),
        }
      ).catch(console.error)

      // =========================
      // ACK CALLBACK
      // =========================
      await fetch(
        `https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callback_query_id: callbackId,
          }),
        }
      ).catch(console.error)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("WEBHOOK ERROR:", error)
    return NextResponse.json({ ok: true }) // ⚠️ important: éviter retry infini Telegram
  }
}

export async function GET() {
  return new Response("Telegram webhook is alive")
}
