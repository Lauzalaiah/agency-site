import { Services } from "@/components/services"
import { Hero } from "@/components/hero"

export default function Home() {
  return (
   <div className="bg-black min-h-screen">
      {/* overlay sombre */}
      <div className="absolute inset-0 z-0 bg-black/60" />

      <div className="relative z-10">
        <Hero />
        <Services />
      </div>
    </div>
  )
}
