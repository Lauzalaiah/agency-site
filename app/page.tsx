"use client"

import ApplyForm from "@/components/apply-form"

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">

      {/* HEADER */}
      <header className="flex justify-between items-center px-10 py-6 border-b border-yellow-500/20">
        <h1 className="text-yellow-500 font-serif text-xl font-bold">
          LEO OFM ELITE
        </h1>
        <nav className="space-x-6 text-sm">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#apply">Apply</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-transparent blur-3xl" />

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-serif text-yellow-500 mb-6 leading-tight">
            We Scale Creators to $10k–$50k/month
          </h1>

          <p className="text-gray-400 mb-8">
            We help creators scale to $10k+/month on Fansly using proven marketing and monetization systems.
          </p>

          <a
            href="#apply"
            className="bg-yellow-500 text-black px-8 py-3 rounded-md font-semibold hover:bg-yellow-400 transition"
          >
            Apply for Private Management →
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-32 text-center px-6">
        <h2 className="text-3xl font-serif text-yellow-500 mb-12">
          Our Services
        </h2>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            ["Marketing", "Growth strategy on social media platforms."],
            ["Fan Messaging", "Professional chat team managing conversations."],
            ["Account Growth", "Optimised pricing and content strategy."],
            ["Traffic", "Targeted traffic acquisition."]
          ].map(([title, desc]) => (
            <div
              key={title}
              className="border border-yellow-500/20 p-6 rounded-lg bg-black hover:border-yellow-500/50 transition"
            >
              <h3 className="text-yellow-500 mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="text-center py-20 border-t border-yellow-500/10 border-b border-yellow-500/10">
        <div className="flex justify-center gap-16 flex-wrap">
          <div>
            <h4 className="text-yellow-500 text-2xl">20+</h4>
            <p className="text-gray-400 text-sm">Creators supported worldwide</p>
          </div>
          <div>
            <h4 className="text-yellow-500 text-2xl">$500,000+</h4>
            <p className="text-gray-400 text-sm">Monthly revenue generated</p>
          </div>
          <div>
            <h4 className="text-yellow-500 text-2xl">Pro</h4>
            <p className="text-gray-400 text-sm">Professional management team</p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-32 text-center">
        <h3 className="text-3xl font-serif text-yellow-500 mb-8">
          Why Join Our Agency
        </h3>

        <ul className="text-gray-300 space-y-3">
          <li>✓ Professional marketing strategy</li>
          <li>✓ Fan messaging management</li>
          <li>✓ Revenue optimization</li>
          <li>✓ Audience growth</li>
        </ul>
      </section>

      {/* APPLY */}
      <section id="apply" className="py-32 text-center px-6">
        <h3 className="text-3xl font-serif text-yellow-500 mb-10">
          Apply for Private Management →
        </h3>

        <ApplyForm />
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 py-10 border-t border-yellow-500/10">
        © 2026 Leo OFM Elite
      </footer>

    </div>
  )
}
