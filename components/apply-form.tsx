"use client"

import { useState } from "react"

export default function ApplyForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const data = {
      name: formData.get("name"),
      instagram: formData.get("instagram"),
      country: formData.get("country"),
      email: formData.get("email"),
    }

    await fetch("/api/apply", {
      method: "POST",
      body: JSON.stringify(data),
    })

    // redirection Telegram
    window.location.href = "https://t.me/Leofm_leads_bot"

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <input name="name" placeholder="Name" className="w-full p-3 bg-black border border-yellow-500/20" />
      <input name="instagram" placeholder="Instagram" className="w-full p-3 bg-black border border-yellow-500/20" />
      <input name="country" placeholder="Country" className="w-full p-3 bg-black border border-yellow-500/20" />
      <input name="email" placeholder="Email" className="w-full p-3 bg-black border border-yellow-500/20" />

      <button className="btn-primary w-full">
        {loading ? "Sending..." : "Submit Application"}
      </button>
    </form>
  )
}
