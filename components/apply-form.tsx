"use client"

import { useState } from "react"

export default function ApplyForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const data = {
      name: formData.get("name"),
      instagram: formData.get("instagram"),
      country: formData.get("country"),
      email: formData.get("email"),
    }

    try {
      await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      setSuccess(true)
      form.reset()

      // 👉 redirection Telegram (propre après succès)
      setTimeout(() => {
        window.location.href = "https://t.me/Leofm_leads_bot"
      }, 1500)

    } catch (error) {
      console.error("Erreur envoi :", error)
    }

    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto grid gap-4"
    >
      <input
        name="name"
        placeholder="Name"
        required
        className="p-3 bg-black border border-yellow-500/20 rounded"
      />

      <input
        name="instagram"
        placeholder="Instagram / Social Media"
        required
        className="p-3 bg-black border border-yellow-500/20 rounded"
      />

      <input
        name="country"
        placeholder="Country"
        required
        className="p-3 bg-black border border-yellow-500/20 rounded"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="p-3 bg-black border border-yellow-500/20 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-500 text-black py-3 rounded font-semibold hover:bg-yellow-400 transition"
      >
        {loading ? "Sending..." : "Submit Application"}
      </button>

      {success && (
        <p className="text-green-400 text-sm">
          Application sent successfully 🚀 Redirecting to Telegram...
        </p>
      )}
    </form>
  )
}
