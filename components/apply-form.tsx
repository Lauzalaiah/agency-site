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
  <div className="space-y-4 text-center">
    <p className="text-green-400 text-sm">
      Application sent successfully 🚀
    </p>

    <p className="text-gray-400 text-sm">
      Final step: contact us on Telegram to validate your application.
    </p>

    <a
      href="https://t.me/leofmelite_bot?start=lead"
      target="_blank"
      className="inline-block bg-yellow-500 text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition"
    >
      Continue on Telegram →
    </a>
  </div>
)}
    </form>
  )
}
