"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    onTurnstileSuccess?: (token: string) => void
    turnstile?: any
  }
}

export default function ApplyForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [captchaToken, setCaptchaToken] = useState("")

  // ✅ Callback propre (évite bugs build / hydration)
  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => {
      setCaptchaToken(token)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)

    if (!captchaToken) {
      setError("Please verify you're human")
      setLoading(false)
      return
    }

    const data = {
      name: formData.get("name"),
      instagram: formData.get("instagram"),
      country: formData.get("country"),
      email: formData.get("email"),
      website: formData.get("website"),
      token: captchaToken,
    }

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || "Failed to send")
      }

      setSuccess(true)
      form.reset()

      // reset captcha
      window.turnstile?.reset()
      setCaptchaToken("")

    } catch (err) {
      console.error(err)
      setError("Something went wrong. Try again.")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto grid gap-4">

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

      {/* Honeypot */}
      <input
        type="text"
        name="website"
        style={{ display: "none" }}
        autoComplete="off"
      />

      {/* Turnstile */}
      <div
        className="cf-turnstile"
        data-sitekey="0x4AAAAAADGigDvm8_0389OF"
        data-callback="onTurnstileSuccess"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-500 text-black py-3 rounded font-semibold hover:bg-yellow-400 transition"
      >
        {loading ? "Sending..." : "Submit Application"}
      </button>

      {error && (
        <p className="text-red-400 text-sm text-center">
          {error}
        </p>
      )}

      {success && (
        <div className="space-y-4 text-center">
          <p className="text-green-400 text-sm">
            Application sent successfully 🚀
          </p>

          <a
            href="https://t.me/leofmelite_bot?start=lead"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-500 text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition"
          >
            Continue on Telegram →
          </a>
        </div>
      )}
    </form>
  )
}
