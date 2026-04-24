import { Services } from '@/components/services'
import { SiteHeader } from '@/components/site-header'

export default function Home() {
  return (
    <div 
      className="relative min-h-screen bg-cover bg-center bg-repeat"
      style={{ backgroundImage: "url('/images/dollar-bg-bright.jpg')" }}
    >
      {/* Overlay leger pour lisibilite du texte */}
      <div className="absolute inset-0 z-0 bg-black/60" />

      <div className="relative z-10 pt-24 max-w-5xl mx-auto">
        <SiteHeader />
        <Services />
      </div>
    </div>
  )
}
