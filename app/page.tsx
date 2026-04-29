import { Services } from "@/components/services"
import { Hero } from "@/components/hero"

export default function Home() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-repeat"
      style={{ backgroundImage: "url('/images/dollar-bg-bright.jpg')" }}
    >
      {/* overlay sombre */}
      <div className="absolute inset-0 z-0 bg-black/60" />

      <div className="relative z-10">
        <Hero />
        <Services />
      </div>
    </div>
  )
}
